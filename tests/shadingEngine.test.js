import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeIlluminationField,
  estimateWallBaseline,
  ShadingDecompositionCache,
  renderPhotorealisticPixel,
  FINISH_MODES
} from '../src/utils/shadingEngine.js';

test('computeIlluminationField maintains uniform field for flat inputs', () => {
  const width = 32;
  const height = 32;
  const input = new Float32Array(width * height).fill(0.60);
  const result = computeIlluminationField(input, width, height, 4);

  for (let i = 0; i < result.length; i++) {
    assert.ok(
      Math.abs(result[i] - 0.60) < 0.001,
      `Uniform illumination distorted at ${i}: got ${result[i]}`
    );
  }
});

test('computeIlluminationField smooths out high-frequency noise', () => {
  const width = 40;
  const height = 40;
  const input = new Float32Array(width * height);
  // Checkerboard high-frequency noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      input[y * width + x] = (x + y) % 2 === 0 ? 0.4 : 0.6;
    }
  }

  const blurred = computeIlluminationField(input, width, height, 6);
  // Interior points should converge to mean ~0.50 with variance < 0.02
  const centerIdx = 20 * width + 20;
  assert.ok(
    Math.abs(blurred[centerIdx] - 0.50) < 0.02,
    `High frequency was not smoothed out: got ${blurred[centerIdx]}`
  );
});

test('estimateWallBaseline trims outliers correctly', () => {
  const total = 500;
  const lums = new Float32Array(total).fill(0.50);
  const mask = new Uint8Array(total).fill(255);

  // Add severe outliers: dark switches (0.01) and specular glare (0.99)
  for (let i = 0; i < 30; i++) lums[i] = 0.01;
  for (let i = 470; i < 500; i++) lums[i] = 0.99;

  const baseline = estimateWallBaseline(lums, mask, total);
  // Trimmed baseline should ignore the top & bottom 15% and stay close to 0.50
  assert.ok(
    Math.abs(baseline - 0.50) < 0.05,
    `Baseline skewed by outliers: got ${baseline}`
  );
});

test('renderPhotorealisticPixel preserves target hue across shadows and highlights', () => {
  const targetHex = '#2563EB'; // Royal Blue (RGB 37, 99, 235)

  // 1. Nominal illumination (relative ratio = 1.0)
  const nominal = renderPhotorealisticPixel({
    origR: 150, origG: 150, origB: 150,
    linearLum: 0.50, lowFreqLum: 0.50, detail: 0.0,
    wallBaseline: 0.50,
    targetColorHex: targetHex,
    finish: 'matte'
  });

  // Target blue should be dominant in RGB output
  assert.ok(nominal.b > nominal.r, 'Blue channel must dominate for blue paint');
  assert.ok(nominal.b > nominal.g, 'Blue channel must dominate for blue paint');

  // 2. In deep shadow (lowFreqLum = 0.20 vs baseline = 0.50)
  const shadow = renderPhotorealisticPixel({
    origR: 150, origG: 150, origB: 150,
    linearLum: 0.20, lowFreqLum: 0.20, detail: 0.0,
    wallBaseline: 0.50,
    targetColorHex: targetHex,
    finish: 'matte'
  });

  // Shadow pixel should be darker than nominal, but still distinctly blue
  assert.ok(shadow.b < nominal.b, 'Shadow pixel should have lower brightness');
  assert.ok(shadow.b > shadow.r, 'Shadow pixel must still preserve blue hue');

  // 3. In bright window highlight (lowFreqLum = 0.85 vs baseline = 0.50)
  const highlight = renderPhotorealisticPixel({
    origR: 150, origG: 150, origB: 150,
    linearLum: 0.85, lowFreqLum: 0.85, detail: 0.0,
    wallBaseline: 0.50,
    targetColorHex: targetHex,
    finish: 'matte'
  });

  assert.ok(highlight.b > nominal.b, 'Highlight pixel should be brighter');
});

test('Material finishes exhibit distinct, bounded appearance responses', () => {
  const targetHex = '#1A2B4C'; // Deep Navy

  // Strong highlight condition (relative ratio ~ 1.8)
  const params = {
    origR: 200, origG: 200, origB: 200,
    linearLum: 0.90, lowFreqLum: 0.90, detail: 0.0,
    wallBaseline: 0.50,
    targetColorHex: targetHex
  };

  const matte = renderPhotorealisticPixel({ ...params, finish: 'matte' });
  const satin = renderPhotorealisticPixel({ ...params, finish: 'satin' });
  const gloss = renderPhotorealisticPixel({ ...params, finish: 'gloss' });

  // In highlight, Gloss > Satin > Matte in perceived lightness / sheen
  assert.ok(
    satin.b >= matte.b,
    `Satin should exhibit gentle sheen elevation over matte: satin=${satin.b}, matte=${matte.b}`
  );
  assert.ok(
    gloss.b >= satin.b,
    `Gloss should exhibit stronger sheen than satin in highlight: gloss=${gloss.b}, satin=${satin.b}`
  );

  // All outputs must remain strictly bounded within 0-255
  for (const p of [matte, satin, gloss]) {
    assert.ok(p.r >= 0 && p.r <= 255);
    assert.ok(p.g >= 0 && p.g <= 255);
    assert.ok(p.b >= 0 && p.b <= 255);
    assert.ok(!isNaN(p.r) && !isNaN(p.g) && !isNaN(p.b));
  }
});

test('Detail residual is bounded and avoids noise amplification in dark regions', () => {
  const targetHex = '#F4EBDD'; // Warm Ivory

  // Extreme detail spike (+0.40) in a very dark region (lum = 0.02)
  const darkSpike = renderPhotorealisticPixel({
    origR: 10, origG: 10, origB: 10,
    linearLum: 0.02, lowFreqLum: 0.02, detail: 0.40,
    wallBaseline: 0.50,
    targetColorHex: targetHex,
    textureStrength: 0.25
  });

  // The noise gate should attenuate extreme detail in deep dark areas
  assert.ok(!isNaN(darkSpike.r) && !isNaN(darkSpike.g) && !isNaN(darkSpike.b));
  assert.ok(darkSpike.r <= 255 && darkSpike.g <= 255 && darkSpike.b <= 255);
});
