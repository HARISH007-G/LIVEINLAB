import { applyLightingToPixel, LIGHTING_PRESETS } from './lightingEngine.js';
import { applyTextureToPixel, FINISH_PRESETS } from './textureEngine.js';
import { RoverSimulator } from './roverSimulator.js';
import { SurfaceSegmentationEngine } from './surfaceSegmentationEngine.js';
import {
  parseHexToRgb,
  rgbToHex as colorSpaceRgbToHex,
  srgbToLinear,
  linearToSrgb,
  srgbToOklab,
  oklabToSrgb,
  getCachedTargetColor
} from './colorSpace.js';
import {
  ShadingDecompositionCache,
  renderPhotorealisticPixel,
  renderPhotorealisticPixelFast,
  FINISH_MODES
} from './shadingEngine.js';
import { SmartBrushEngine } from './smartBrushEngine.js';
import { IndoorSegmentationEngine } from './indoorSegmentationEngine.js';

export const DEFAULT_ENGINE_CONFIG = {
  maxWorkingDimension: 1600,
  maxHistory: 25,
  defaultBrushSize: 40,
  defaultBrushSoftness: 50,
  defaultTolerance: 35,
  defaultPaintStrength: 0.90,
  defaultLightingPreservation: 0.85,
  defaultTexturePreservation: 0.25,
  defaultBlendMode: 'natural',
  defaultRenderingStrategy: 'photorealistic' // 'photorealistic' (Phase 1) | 'legacy'
};

export function hexToRgb(hex) {
  const parsed = parseHexToRgb(hex);
  return { r: parsed.r, g: parsed.g, b: parsed.b };
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

export function calculateLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function clamp(val, min = 0, max = 255) {
  return Math.min(max, Math.max(min, val));
}

// Re-export color science primitives for convenience
export {
  srgbToLinear,
  linearToSrgb,
  srgbToOklab,
  oklabToSrgb,
  getCachedTargetColor
};

/**
 * Creates a standalone Paint Engine instance with Multi-Surface Architecture & Photorealistic Rendering
 */
export function createPaintEngine(customConfig = {}) {
  const config = { ...DEFAULT_ENGINE_CONFIG, ...customConfig };
  const segmentationEngine = new SurfaceSegmentationEngine();
  const indoorSegmentationEngine = new IndoorSegmentationEngine();
  const shadingCache = new ShadingDecompositionCache();
  const smartBrushEngine = new SmartBrushEngine();

  let originalImage = null;
  let originalWidth = 0;
  let originalHeight = 0;

  let workingWidth = 0;
  let workingHeight = 0;
  let workingScale = 1.0;

  // Image & Layer Buffers
  let originalImageData = null;
  let luminanceMap = null;
  let textureMap = null;
  let edgeMap = null;
  let gradMagnitudeMap = null;
  let protectedMask = null;

  // Scene Profile
  let sceneProfile = null;

  // Canvases
  let baseCanvas = null;
  let baseCtx = null;
  let renderCanvas = null;
  let renderCtx = null;

  let currentTargetColor = '#2563EB';
  let currentPaintStrength = config.defaultPaintStrength;
  let currentLightingPreservation = config.defaultLightingPreservation;
  let currentTexturePreservation = config.defaultTexturePreservation;
  let currentBlendMode = config.defaultBlendMode;
  let currentRenderingStrategy = config.defaultRenderingStrategy;

  function initCanvases(w, h) {
    baseCanvas = document.createElement('canvas');
    baseCanvas.width = w;
    baseCanvas.height = h;
    baseCtx = baseCanvas.getContext('2d', { willReadFrequently: true });

    renderCanvas = document.createElement('canvas');
    renderCanvas.width = w;
    renderCanvas.height = h;
    renderCtx = renderCanvas.getContext('2d', { willReadFrequently: true });
  }

  function profileImage() {
    if (!originalImageData) return;
    const total = workingWidth * workingHeight;
    const data = originalImageData.data;

    luminanceMap = new Float32Array(total);
    gradMagnitudeMap = new Float32Array(total);
    edgeMap = new Uint8Array(total);
    textureMap = new Float32Array(total);
    protectedMask = new Uint8Array(total);

    let sumLum = 0;
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
      luminanceMap[i] = lum;
      sumLum += lum;
    }
    const meanLum = sumLum / total;

    // Sobel gradients
    for (let y = 1; y < workingHeight - 1; y++) {
      for (let x = 1; x < workingWidth - 1; x++) {
        const idx = y * workingWidth + x;
        const left = luminanceMap[idx - 1];
        const right = luminanceMap[idx + 1];
        const up = luminanceMap[(y - 1) * workingWidth + x];
        const down = luminanceMap[(y + 1) * workingWidth + x];

        const gx = -left + right;
        const gy = -up + down;
        const grad = Math.sqrt(gx * gx + gy * gy);

        gradMagnitudeMap[idx] = grad;
        edgeMap[idx] = grad > 0.22 ? 1 : 0;
        textureMap[idx] = clamp(grad * 1.5, 0, 1);
      }
    }

    // Protected areas: floors, sky, glare, plants
    for (let y = 0; y < workingHeight; y++) {
      const yNorm = y / workingHeight;
      for (let x = 0; x < workingWidth; x++) {
        const idx = y * workingWidth + x;
        const p = idx * 4;
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        const lum = luminanceMap[idx];

        if (lum > 0.96 || lum < 0.04) {
          protectedMask[idx] = 1;
          continue;
        }
        if (yNorm < 0.22 && ((b > r + 18 && b > g + 10) || (lum > 0.88 && r > 220 && g > 220 && b > 220))) {
          protectedMask[idx] = 1;
          continue;
        }
        if (yNorm > 0.85 && ((Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && lum < 0.50) || lum < 0.18)) {
          protectedMask[idx] = 1;
          continue;
        }
        if ((g > r + 24 && g > b + 14) || (g > 115 && g > r * 1.22 && g > b * 1.15)) {
          protectedMask[idx] = 1;
          continue;
        }
      }
    }

    sceneProfile = { meanLum, isOutdoorSky: false };

    // Prime the photorealistic shading decomposition cache
    shadingCache.ensureDecomposition(originalImageData, workingWidth, workingHeight);

    // Initialize Smart Brush & Canny edge detector
    smartBrushEngine.init(originalImageData);
  }

  return {
    async loadImage(img) {
      return new Promise((resolve, reject) => {
        try {
          originalImage = img;
          originalWidth = img.naturalWidth || img.width;
          originalHeight = img.naturalHeight || img.height;

          const maxDim = Math.max(originalWidth, originalHeight);
          workingScale = maxDim > config.maxWorkingDimension
            ? config.maxWorkingDimension / maxDim
            : 1.0;

          workingWidth = Math.max(1, Math.round(originalWidth * workingScale));
          workingHeight = Math.max(1, Math.round(originalHeight * workingScale));

          initCanvases(workingWidth, workingHeight);

          baseCtx.drawImage(img, 0, 0, workingWidth, workingHeight);
          originalImageData = baseCtx.getImageData(0, 0, workingWidth, workingHeight);

          profileImage();

          resolve({
            originalWidth,
            originalHeight,
            workingWidth,
            workingHeight,
            scale: workingScale,
            profile: sceneProfile
          });
        } catch (err) {
          reject(err);
        }
      });
    },

    /**
     * Run full indoor semantic surface segmentation
     */
    async segmentSurfaces({ sensitivity = 0.75 } = {}) {
      if (!originalImageData) return [];
      const result = await indoorSegmentationEngine.segmentScene(originalImageData, { sensitivity });
      if (result.protectedMask) {
        protectedMask = result.protectedMask;
      }
      return result.surfaces;
    },

    /**
     * Interactive Magic Wand for a specific surface
     */
    floodFillSurface(startX, startY, { tolerance = 35, edgeSnap = 'MEDIUM' } = {}) {
      if (!originalImageData) return null;
      return segmentationEngine.floodFillSurface(originalImageData, startX, startY, { tolerance, edgeSnap });
    },

    /**
     * Smart Brush & Edge-Aware Painting on Surface
     */
    drawBrushStrokeOnSurface(surface, x0, y0, x1, y1, radius = 24, hardness = 0.7, mode = 'paint', edgeSnap = 'MEDIUM') {
      if (!surface || !surface.mask || !originalImageData) return;
      smartBrushEngine.paintSmartBrush(surface.mask, x0, y0, x1, y1, {
        radius,
        hardness,
        mode,
        edgeSnap,
        protectedMask
      });
    },

    paintSmartBrush(surface, x0, y0, x1, y1, options = {}) {
      if (!surface || !surface.mask || !originalImageData) return;
      smartBrushEngine.paintSmartBrush(surface.mask, x0, y0, x1, y1, {
        ...options,
        protectedMask
      });
    },

    refineSurfaceMask(surface, options = {}) {
      if (!surface || !surface.mask) return null;
      const refined = smartBrushEngine.refineMask(surface.mask, {
        ...options,
        protectedMask
      });
      surface.mask = refined;
      return refined;
    },

    computeSurfaceConfidence(surface) {
      if (!surface || !surface.mask) return 0.85;
      return smartBrushEngine.computeBoundaryConfidence(surface.mask);
    },

    setPaintParameters({
      color,
      paintStrength,
      lightingPreservation,
      texturePreservation,
      blendMode,
      renderingStrategy
    } = {}) {
      if (color !== undefined) currentTargetColor = color;
      if (paintStrength !== undefined) currentPaintStrength = clamp(paintStrength, 0.1, 1.0);
      if (lightingPreservation !== undefined) currentLightingPreservation = clamp(lightingPreservation, 0.0, 1.0);
      if (texturePreservation !== undefined) currentTexturePreservation = clamp(texturePreservation, 0.0, 1.0);
      if (blendMode !== undefined) currentBlendMode = blendMode;
      if (renderingStrategy !== undefined) currentRenderingStrategy = renderingStrategy;
    },

    /**
     * Multi-Surface Priority Compositor
     * Supports both Phase 1 Photorealistic Mode & Legacy Fallback
     */
    renderComposite({
      targetCanvas,
      comparisonMode = 'after',
      splitPosition = 0.5,
      showMask = false,
      activeSurfaceId = null,
      lighting = null,
      finish = 'matte',
      surfaces = [],
      roverSimulator = null,
      debugMode = false,
      renderingStrategy = currentRenderingStrategy
    } = {}) {
      if (!originalImageData || !targetCanvas) return;

      const destCtx = targetCanvas.getContext('2d');
      if (targetCanvas.width !== workingWidth || targetCanvas.height !== workingHeight) {
        targetCanvas.width = workingWidth;
        targetCanvas.height = workingHeight;
      }

      const outputImageData = renderCtx.createImageData(workingWidth, workingHeight);
      const outData = outputImageData.data;
      const srcData = originalImageData.data;

      const total = workingWidth * workingHeight;
      const splitX = Math.round(workingWidth * splitPosition);

      // Sort surfaces by priority: Trim top priority, then Accent Wall, then Main Wall
      const sortedSurfaces = [...(surfaces || [])].sort((a, b) => {
        const getPriority = (s) => {
          if (s.type === 'trim' || s.name.toLowerCase().includes('trim')) return 3;
          if (s.type === 'accent-wall' || s.name.toLowerCase().includes('accent')) return 2;
          if (s.type === 'ceiling' || s.name.toLowerCase().includes('ceiling')) return 1;
          return 0;
        };
        return getPriority(b) - getPriority(a);
      });

      const activeSurface = surfaces?.find(s => s.id === activeSurfaceId) || surfaces?.[0] || null;

      // Ensure shading decomposition cache is ready for photorealistic rendering
      const isPhotorealistic = renderingStrategy === 'photorealistic';
      const surfaceRenderProps = new Map();
      let linLum = null;
      let lowFreq = null;
      let detail = null;

      if (isPhotorealistic) {
        shadingCache.ensureDecomposition(originalImageData, workingWidth, workingHeight);
        linLum = shadingCache.linearLuminance;
        lowFreq = shadingCache.illuminationField;
        detail = shadingCache.detailField;

        for (const srf of sortedSurfaces) {
          const baseline = shadingCache.getWallBaseline(srf.id, srf.mask);
          const srfFinish = srf.finish || finish || 'matte';
          const srfColor = srf.color || '#F4EBDD';
          surfaceRenderProps.set(srf.id, {
            baseline,
            target: getCachedTargetColor(srfColor),
            finishConfig: FINISH_MODES[srfFinish] || FINISH_MODES.matte,
            shadingStrength: srf.lightingPreservation ?? currentLightingPreservation,
            textureStrength: srf.texturePreservation ?? currentTexturePreservation
          });
        }
      }

      for (let i = 0; i < total; i++) {
        const p = i * 4;
        const x = i % workingWidth;
        const y = Math.floor(i / workingWidth);
        let origR = srcData[p];
        let origG = srcData[p + 1];
        let origB = srcData[p + 2];
        const origA = srcData[p + 3];

        const lum = luminanceMap ? luminanceMap[i] : 0.5;

        // Apply environmental lighting preset to original image if active
        if (lighting) {
          const litOrig = applyLightingToPixel({ r: origR, g: origG, b: origB }, lighting, lum);
          origR = litOrig.r;
          origG = litOrig.g;
          origB = litOrig.b;
        }

        // Check if pixel is in Protected Mask (Windows, Doors, Furniture, Floor)
        const isProtected = protectedMask && protectedMask[i] === 1;

        // Check which surface covers this pixel according to priority
        let winningSurface = null;
        let surfaceAlpha = 0;

        if (!isProtected && sortedSurfaces.length > 0) {
          for (const srf of sortedSurfaces) {
            if (srf.mask && srf.mask[i] > 10) {
              winningSurface = srf;
              surfaceAlpha = srf.mask[i] / 255.0;
              break;
            }
          }
        }

        const isOriginalSide = comparisonMode === 'before' || (comparisonMode === 'split' && x < splitX);

        if (isOriginalSide || !winningSurface || surfaceAlpha === 0) {
          // Untouched original pixel - non-destructive & mask-safe
          outData[p] = origR;
          outData[p + 1] = origG;
          outData[p + 2] = origB;
          outData[p + 3] = origA;
        } else if (isPhotorealistic) {
          // =========================================================
          // STRATEGY 2: PHOTOREALISTIC SHADING & OKLAB COLOR TRANSFER
          // =========================================================
          const props = surfaceRenderProps.get(winningSurface.id) || {
            baseline: 0.45,
            target: getCachedTargetColor(winningSurface.color || '#F4EBDD'),
            finishConfig: FINISH_MODES[winningSurface.finish || finish || 'matte'] || FINISH_MODES.matte,
            shadingStrength: winningSurface.lightingPreservation ?? currentLightingPreservation,
            textureStrength: winningSurface.texturePreservation ?? currentTexturePreservation
          };

          const painted = renderPhotorealisticPixelFast(
            origR,
            origG,
            origB,
            linLum[i],
            lowFreq[i],
            detail[i],
            props.baseline,
            props.target,
            props.finishConfig,
            props.shadingStrength,
            props.textureStrength,
            1.0
          );

          let r = painted.r;
          let g = painted.g;
          let b = painted.b;

          // Environmental Lighting Simulation
          if (lighting) {
            const lit = applyLightingToPixel({ r, g, b }, lighting, lum);
            r = lit.r;
            g = lit.g;
            b = lit.b;
          }

          // Non-destructive, halo-free alpha compositing
          const finalR = clamp(r * surfaceAlpha + origR * (1 - surfaceAlpha));
          const finalG = clamp(g * surfaceAlpha + origG * (1 - surfaceAlpha));
          const finalB = clamp(b * surfaceAlpha + origB * (1 - surfaceAlpha));

          outData[p] = Math.round(finalR);
          outData[p + 1] = Math.round(finalG);
          outData[p + 2] = Math.round(finalB);
          outData[p + 3] = origA; // Preserve source alpha
        } else {
          // =========================================================
          // STRATEGY 1: LEGACY-COMPATIBLE FALLBACK RECOLORING
          // =========================================================
          const surfaceRgb = hexToRgb(winningSurface.color || '#F4EBDD');
          const srfFinish = FINISH_PRESETS[winningSurface.finish] || FINISH_PRESETS[finish] || FINISH_PRESETS.matte;

          const lumFactor = Math.pow(lum + 0.05, 1.0 - (winningSurface.lightingPreservation || 0.75) * 0.45);
          const normalizedLum = lumFactor * 1.6;

          let r = surfaceRgb.r * normalizedLum;
          let g = surfaceRgb.g * normalizedLum;
          let b = surfaceRgb.b * normalizedLum;

          const pStrength = winningSurface.strength || 0.90;
          r = r * pStrength + origR * (1 - pStrength);
          g = g * pStrength + origG * (1 - pStrength);
          b = b * pStrength + origB * (1 - pStrength);

          const textured = applyTextureToPixel({ r, g, b }, srfFinish, x, y, lum);
          r = textured.r;
          g = textured.g;
          b = textured.b;

          if (lighting) {
            const lit = applyLightingToPixel({ r, g, b }, lighting, lum);
            r = lit.r;
            g = lit.g;
            b = lit.b;
          }

          const finalR = clamp(r * surfaceAlpha + origR * (1 - surfaceAlpha));
          const finalG = clamp(g * surfaceAlpha + origG * (1 - surfaceAlpha));
          const finalB = clamp(b * surfaceAlpha + origB * (1 - surfaceAlpha));

          outData[p] = Math.round(finalR);
          outData[p + 1] = Math.round(finalG);
          outData[p + 2] = Math.round(finalB);
          outData[p + 3] = origA;
        }

        // Mask Overlay Mode
        if (showMask) {
          if (activeSurface && activeSurface.mask && activeSurface.mask[i] > 10) {
            const a = (activeSurface.mask[i] / 255.0) * 0.35;
            outData[p] = Math.round(outData[p] * (1 - a) + 34 * a);
            outData[p + 1] = Math.round(outData[p + 1] * (1 - a) + 211 * a);
            outData[p + 2] = Math.round(outData[p + 2] * (1 - a) + 238 * a);
          } else if (!isProtected && winningSurface && winningSurface.id !== activeSurface?.id) {
            outData[p] = Math.round(outData[p] * 0.7);
            outData[p + 1] = Math.round(outData[p + 1] * 0.7);
            outData[p + 2] = Math.round(outData[p + 2] * 0.7);
          }
        }

        // Debug Mode Visualization
        if (debugMode) {
          if (isProtected) {
            outData[p] = Math.round(outData[p] * 0.6 + 100);
          } else if (edgeMap && edgeMap[i] === 1) {
            outData[p + 1] = 255;
          }
        }
      }

      destCtx.putImageData(outputImageData, 0, 0);

      // Draw Active Surface Boundary Glow Outline
      if (activeSurface && activeSurface.mask && !debugMode) {
        destCtx.save();
        destCtx.strokeStyle = 'rgba(34, 211, 238, 0.75)';
        destCtx.lineWidth = 1.5;
        destCtx.shadowColor = 'rgba(34, 211, 238, 0.8)';
        destCtx.shadowBlur = 8;

        const mask = activeSurface.mask;
        const step = Math.max(2, Math.floor(workingWidth / 400));

        destCtx.beginPath();
        for (let y = step; y < workingHeight - step; y += step) {
          for (let x = step; x < workingWidth - step; x += step) {
            const idx = y * workingWidth + x;
            if (mask[idx] > 100) {
              const left = mask[idx - step];
              const right = mask[idx + step];
              const up = mask[(y - step) * workingWidth + x];
              const down = mask[(y + step) * workingWidth + x];

              if (left < 50 || right < 50 || up < 50 || down < 50) {
                destCtx.rect(x, y, 1, 1);
              }
            }
          }
        }
        destCtx.stroke();
        destCtx.restore();
      }

      // Render Rover Spray Path Simulation Overlay
      if (roverSimulator && roverSimulator.isActive) {
        roverSimulator.update(winningSurfaceColorHex(activeSurface));
        roverSimulator.draw(destCtx, workingWidth, workingHeight);
      }

      // Split Divider Line & Comparison Handle
      if (comparisonMode === 'split') {
        destCtx.save();
        destCtx.strokeStyle = '#FFFFFF';
        destCtx.lineWidth = 2;
        destCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        destCtx.shadowBlur = 6;

        destCtx.beginPath();
        destCtx.moveTo(splitX, 0);
        destCtx.lineTo(splitX, workingHeight);
        destCtx.stroke();

        const centerY = workingHeight / 2;
        destCtx.beginPath();
        destCtx.arc(splitX, centerY, 18, 0, Math.PI * 2);
        destCtx.fillStyle = '#FFFFFF';
        destCtx.fill();
        destCtx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        destCtx.lineWidth = 2;
        destCtx.stroke();

        destCtx.fillStyle = '#0F172A';
        destCtx.font = 'bold 12px sans-serif';
        destCtx.textAlign = 'center';
        destCtx.textBaseline = 'middle';
        destCtx.fillText('◀ ▶', splitX, centerY);
        destCtx.restore();
      }
    },

    renderMultiSurfaceComposite(targetCanvas, surfaces, options = {}) {
      return this.renderComposite({
        targetCanvas,
        surfaces,
        comparisonMode: options.splitPosition !== undefined ? 'split' : 'after',
        splitPosition: options.splitPosition !== undefined ? options.splitPosition : 0.5,
        lighting: options.lightingMode ? (LIGHTING_PRESETS[options.lightingMode] || null) : null,
        finish: options.finish || 'matte',
        showMask: options.showMask || false,
        activeSurfaceId: options.activeSurfaceId || null,
        debugMode: options.debugMode || false,
        renderingStrategy: options.renderingStrategy || currentRenderingStrategy
      });
    },

    getSurfaceBounds(surface) {
      if (!surface || !surface.mask) {
        return { minX: 50, maxX: Math.max(100, workingWidth - 50), minY: 50, maxY: Math.max(100, workingHeight - 50) };
      }
      const mask = surface.mask;
      let minX = workingWidth, maxX = 0, minY = workingHeight, maxY = 0;
      let found = false;
      for (let y = 0; y < workingHeight; y += 4) {
        for (let x = 0; x < workingWidth; x += 4) {
          if (mask[y * workingWidth + x] > 20) {
            found = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (!found) {
        return { minX: 50, maxX: Math.max(100, workingWidth - 50), minY: 50, maxY: Math.max(100, workingHeight - 50) };
      }
      return { minX, maxX, minY, maxY };
    },

    screenToCanvasCoordinates(clientX, clientY, canvasElement) {
      if (!canvasElement) return { x: 0, y: 0 };
      const rect = canvasElement.getBoundingClientRect();
      const scaleX = workingWidth / (rect.width || 1);
      const scaleY = workingHeight / (rect.height || 1);
      return {
        x: Math.round(clamp((clientX - rect.left) * scaleX, 0, workingWidth - 1)),
        y: Math.round(clamp((clientY - rect.top) * scaleY, 0, workingHeight - 1))
      };
    },

    getWorkingDimensions() {
      return { width: workingWidth, height: workingHeight };
    },

    getProtectedMask() {
      return protectedMask;
    },

    getEdgeMap() {
      return edgeMap;
    },

    getShadingCache() {
      return shadingCache;
    },

    destroy() {
      originalImageData = null;
      luminanceMap = null;
      edgeMap = null;
      protectedMask = null;
      shadingCache.invalidate();
    }
  };
}

function winningSurfaceColorHex(activeSurface) {
  return activeSurface?.color || '#22D3EE';
}
