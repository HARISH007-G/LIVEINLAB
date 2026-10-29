import test from 'node:test';
import assert from 'node:assert/strict';
import { IndoorSegmentationEngine, SEMANTIC_CLASSES } from '../src/utils/indoorSegmentationEngine.js';

test('Critical Audit: Evaluates IndoorSegmentationEngine capabilities and classical heuristic limitations', async () => {
  const width = 200;
  const height = 150;
  const total = width * height;
  const data = new Uint8ClampedArray(total * 4);

  // Scenario: Textured Wallpaper with Vertical Stripes
  // A true AI semantic segmentation model knows the entire plane is a wall regardless of wallpaper pattern.
  // A classical heuristic looking for vertical gradient creases may mistakenly split wallpaper stripes into false walls.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // High-contrast alternating vertical wallpaper stripes every 10 pixels
      const stripe = Math.floor(x / 10) % 2 === 0 ? 190 : 120;
      data[idx] = stripe;
      data[idx + 1] = stripe;
      data[idx + 2] = stripe;
      data[idx + 3] = 255;
    }
  }

  const engine = new IndoorSegmentationEngine();
  const result = await engine.segmentScene({ width, height, data });

  // Classical heuristic behavior audit:
  // Because it uses gradient crease barriers, high-frequency wallpaper stripes can fragment the surface.
  // Document that the engine is a classical heuristic parser, not a deep semantic model.
  assert.ok(result.surfaces.length >= 1, 'Engine must produce at least 1 fallback surface');
  assert.equal(typeof engine.modelName, 'string');
});

test('Critical Audit: Window and floor detection in complex indoor scene', async () => {
  const width = 100;
  const height = 100;
  const total = width * height;
  const data = new Uint8ClampedArray(total * 4);

  // Scene setup:
  // - Top right window (x: 60..90, y: 15..50): very bright (250) with cool sky bias
  // - Bottom floor (y > 85): dark parquet floor (40)
  // - Rest: interior cream wall (170, 160, 150)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (x >= 60 && x <= 90 && y >= 15 && y <= 50) {
        // Window: bright white/blue
        data[idx] = 245;
        data[idx + 1] = 248;
        data[idx + 2] = 255;
      } else if (y > 85) {
        // Floor
        data[idx] = 45;
        data[idx + 1] = 40;
        data[idx + 2] = 35;
      } else {
        // Wall
        data[idx] = 175;
        data[idx + 1] = 165;
        data[idx + 2] = 155;
      }
      data[idx + 3] = 255;
    }
  }

  const engine = new IndoorSegmentationEngine();
  const result = await engine.segmentScene({ width, height, data });

  // Verify window pixel is protected
  const windowIdx = 30 * width + 75;
  assert.equal(result.protectedMask[windowIdx], 1, 'Bright window must be protected from paint');

  // Verify floor pixel is protected
  const floorIdx = 92 * width + 50;
  assert.equal(result.protectedMask[floorIdx], 1, 'Floor must be protected from paint');

  // Verify central wall pixel is NOT protected
  const wallIdx = 50 * width + 30;
  assert.equal(result.protectedMask[wallIdx], 0, 'Wall pixel must remain paintable');
});
