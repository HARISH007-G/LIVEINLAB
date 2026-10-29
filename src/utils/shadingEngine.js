/**
 * VANNAM Shading and Illumination Engine
 * 
 * Physically Motivated Shading-Preserving Wall Recoloring Pipeline:
 * 1. Linear-Light Luminance Analysis
 * 2. Robust Wall-Region Baseline Estimation (Trimmed Statistics)
 * 3. Separable Fast Low-Pass Filter for Broad Illumination Gradients
 * 4. High-Frequency Surface Detail Residual Extraction
 * 5. Perceptual Color Transfer in Oklab Space
 * 6. Plausible Material Finish Appearance (Matte, Satin, Gloss, Stucco)
 */

import {
  srgbToLinearChannel,
  linearToSrgbChannel,
  fastLinearToSrgb,
  linearLuminance,
  linearRgbToOklab,
  oklabToLinearRgb,
  getCachedTargetColor
} from './colorSpace.js';

export const FINISH_MODES = {
  matte: {
    id: 'matte',
    name: 'Ultra Matte',
    shadingWeight: 1.0,
    textureWeight: 1.0,
    sheenStrength: 0.0,
    sheenThreshold: 1.0,
    sheenExponent: 1.0
  },
  satin: {
    id: 'satin',
    name: 'Satin / Eggshell',
    shadingWeight: 1.0,
    textureWeight: 0.85,
    sheenStrength: 0.20,
    sheenThreshold: 1.05,
    sheenExponent: 2.0
  },
  gloss: {
    id: 'gloss',
    name: 'High Gloss',
    shadingWeight: 1.0,
    textureWeight: 0.70,
    sheenStrength: 0.50,
    sheenThreshold: 1.05,
    sheenExponent: 2.2
  },
  stucco: {
    id: 'stucco',
    name: 'Venetian Stucco',
    shadingWeight: 1.05,
    textureWeight: 1.50,
    sheenStrength: 0.08,
    sheenThreshold: 1.10,
    sheenExponent: 2.0
  }
};

/**
 * Fast 1D horizontal box blur pass on Float32Array.
 */
function boxBlurH(source, target, width, height, radius) {
  const invKernel = 1.0 / (2 * radius + 1);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    let sum = 0;

    // Initialize window
    for (let x = -radius; x <= radius; x++) {
      const clampedX = Math.max(0, Math.min(width - 1, x));
      sum += source[rowOffset + clampedX];
    }
    target[rowOffset] = sum * invKernel;

    // Slide window across row
    for (let x = 1; x < width; x++) {
      const addX = Math.min(width - 1, x + radius);
      const subX = Math.max(0, x - radius - 1);
      sum += source[rowOffset + addX] - source[rowOffset + subX];
      target[rowOffset + x] = sum * invKernel;
    }
  }
}

/**
 * Fast 1D vertical box blur pass on Float32Array.
 */
function boxBlurV(source, target, width, height, radius) {
  const invKernel = 1.0 / (2 * radius + 1);
  for (let x = 0; x < width; x++) {
    let sum = 0;

    // Initialize window
    for (let y = -radius; y <= radius; y++) {
      const clampedY = Math.max(0, Math.min(height - 1, y));
      sum += source[clampedY * width + x];
    }
    target[x] = sum * invKernel;

    // Slide window down column
    for (let y = 1; y < height; y++) {
      const addY = Math.min(height - 1, y + radius);
      const subY = Math.max(0, y - radius - 1);
      sum += source[addY * width + x] - source[subY * width + x];
      target[y * width + x] = sum * invKernel;
    }
  }
}

/**
 * 2-pass separable box filter approximating broad spatial illumination field.
 */
export function computeIlluminationField(linearLuminanceArray, width, height, radius = 16) {
  const total = width * height;
  const temp = new Float32Array(total);
  const result = new Float32Array(total);

  boxBlurH(linearLuminanceArray, temp, width, height, radius);
  boxBlurV(temp, result, width, height, radius);

  return result;
}

/**
 * Computes a robust trimmed baseline linear luminance for a masked wall region.
 * Ignores extreme dark spots (hardware/switches) and hot highlights (reflections/glare).
 */
export function estimateWallBaseline(linearLuminanceArray, maskArray, totalPixels) {
  let count = 0;
  let sum = 0;

  // Sampling up to 2000 points across the mask for fast, robust trimmed estimation
  const step = Math.max(1, Math.floor(totalPixels / 2000));
  const samples = [];

  for (let i = 0; i < totalPixels; i += step) {
    if (maskArray && maskArray[i] > 32) {
      samples.push(linearLuminanceArray[i]);
    }
  }

  if (samples.length < 10) {
    // Fallback if mask is very small or empty
    return 0.45;
  }

  samples.sort((a, b) => a - b);
  // Trim top 15% and bottom 15% to eliminate shadows & glare
  const trimStart = Math.floor(samples.length * 0.15);
  const trimEnd = Math.floor(samples.length * 0.85);

  for (let i = trimStart; i < trimEnd; i++) {
    sum += samples[i];
    count++;
  }

  return count > 0 ? Math.max(0.04, sum / count) : 0.45;
}

/**
 * Shading & Texture Decomposition Cache Container
 */
export class ShadingDecompositionCache {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.linearLuminance = null;
    this.illuminationField = null;
    this.detailField = null;
    this.wallBaselines = new Map(); // surfaceId -> baseline linear lum
    this.sourceFingerprint = null;
  }

  /**
   * Initializes or reuses the decomposition cache for a working image.
   */
  ensureDecomposition(originalImageData, width, height, radius) {
    const total = width * height;
    if (
      this.width === width &&
      this.height === height &&
      this.linearLuminance &&
      this.illuminationField &&
      this.detailField
    ) {
      return;
    }

    this.width = width;
    this.height = height;
    this.linearLuminance = new Float32Array(total);
    this.wallBaselines.clear();

    const data = originalImageData.data;
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      const rLin = srgbToLinearChannel(data[p]);
      const gLin = srgbToLinearChannel(data[p + 1]);
      const bLin = srgbToLinearChannel(data[p + 2]);
      this.linearLuminance[i] = linearLuminance(rLin, gLin, bLin);
    }

    const blurRadius = radius || Math.max(8, Math.round(Math.min(width, height) * 0.02));
    this.illuminationField = computeIlluminationField(this.linearLuminance, width, height, blurRadius);

    this.detailField = new Float32Array(total);
    for (let i = 0; i < total; i++) {
      // High-frequency detail residual: original linear luminance minus broad illumination
      this.detailField[i] = this.linearLuminance[i] - this.illuminationField[i];
    }
  }

  getWallBaseline(surfaceId, maskArray) {
    if (this.wallBaselines.has(surfaceId)) {
      return this.wallBaselines.get(surfaceId);
    }
    const baseline = estimateWallBaseline(this.linearLuminance, maskArray, this.width * this.height);
    this.wallBaselines.set(surfaceId, baseline);
    return baseline;
  }

  invalidate() {
    this.width = 0;
    this.height = 0;
    this.linearLuminance = null;
    this.illuminationField = null;
    this.detailField = null;
    this.wallBaselines.clear();
  }
}

/**
 * High-performance inner-loop pixel renderer with zero object allocations.
 */
export function renderPhotorealisticPixelFast(
  origR, origG, origB,
  linearLum, lowFreqLum, detail,
  wallBaseline,
  target, finishConfig,
  shadingStrength, textureStrength, sheenStrength
) {
  // 1. Relative Illumination Ratio
  const epsilon = 0.015;
  const rawRatio = (lowFreqLum + epsilon) / (wallBaseline + epsilon);
  const clampedRatio = Math.max(0.12, Math.min(2.4, rawRatio));

  const effShadingWeight = shadingStrength * finishConfig.shadingWeight;
  const effRatio = 1.0 + (clampedRatio - 1.0) * effShadingWeight;

  // 2. Perceptual Lightness Modulation in Oklab Space
  const lumScale = Math.cbrt(Math.max(0.01, effRatio));
  let L = Math.max(0.02, Math.min(0.98, target.oklab.L * lumScale));

  // 3. Surface Detail Residual Injection
  const noiseGate = Math.max(0, Math.min(1, (linearLum - 0.02) * 12.5));
  const effTextureWeight = textureStrength * finishConfig.textureWeight * noiseGate;
  const boundedDetail = Math.max(-0.20, Math.min(0.20, detail)) * effTextureWeight;
  L = Math.max(0.01, Math.min(0.99, L + boundedDetail));

  // 4. Material Finish Sheen Approximation
  let sheenBoost = 0;
  if (finishConfig.sheenStrength > 0 && effRatio > finishConfig.sheenThreshold) {
    const overThreshold = (effRatio - finishConfig.sheenThreshold) / (2.4 - finishConfig.sheenThreshold);
    const sheenFactor = Math.pow(Math.max(0, Math.min(1, overThreshold)), finishConfig.sheenExponent);
    sheenBoost = sheenFactor * finishConfig.sheenStrength * sheenStrength * 0.30;
    L = Math.min(0.995, L + sheenBoost);
  }

  // 5. Chromatic Adaptation
  const chromaGate = Math.max(0.35, Math.min(1.05, Math.sqrt(effRatio)));
  const a = target.oklab.a * chromaGate;
  const b = target.oklab.b * chromaGate;

  // 6. Fast Oklab -> Linear RGB -> sRGB 8-bit LUT
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  if (sheenBoost > 0.02) {
    const spec = (sheenBoost - 0.02) * 0.35;
    rLin += spec;
    gLin += spec;
    bLin += spec;
  }

  return {
    r: fastLinearToSrgb(rLin),
    g: fastLinearToSrgb(gLin),
    b: fastLinearToSrgb(bLin)
  };
}

/**
 * Standard pixel-level caller (convenience interface).
 */
export function renderPhotorealisticPixel({
  origR,
  origG,
  origB,
  linearLum,
  lowFreqLum,
  detail,
  wallBaseline,
  targetColorHex,
  finish = 'matte',
  shadingStrength = 0.85,
  textureStrength = 0.25,
  sheenStrength = 1.0
}) {
  const target = getCachedTargetColor(targetColorHex);
  const finishConfig = FINISH_MODES[finish] || FINISH_MODES.matte;

  return renderPhotorealisticPixelFast(
    origR, origG, origB,
    linearLum, lowFreqLum, detail,
    wallBaseline,
    target, finishConfig,
    shadingStrength, textureStrength, sheenStrength
  );
}
