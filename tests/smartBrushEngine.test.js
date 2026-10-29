import test from 'node:test';
import assert from 'node:assert/strict';
import { SmartBrushEngine } from '../src/utils/smartBrushEngine.js';

test('SmartBrushEngine computes Canny edges and Sobel gradients correctly', () => {
  const width = 100;
  const height = 100;
  const data = new Uint8ClampedArray(width * height * 4);

  // Left half light (200), Right half dark (40) -> strong vertical edge at x=50
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const val = x < 50 ? 200 : 40;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  const engine = new SmartBrushEngine();
  engine.init({ width, height, data });

  assert.equal(engine.width, 100);
  assert.equal(engine.height, 100);
  assert.ok(engine.gradMagnitude[50 * 100 + 49] > 0.3, 'Sobel gradient must peak near the boundary');
  assert.equal(engine.cannyEdges[50 * 100 + 49], 1, 'Canny edge should be detected at x=49/50');
  assert.equal(engine.cannyEdges[50 * 100 + 10], 0, 'No edge inside flat region');
});

test('Smart Brush respects edge barriers and does not leak across structural edges', () => {
  const width = 80;
  const height = 80;
  const data = new Uint8ClampedArray(width * height * 4);

  // Vertical boundary at x=40
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const val = x < 40 ? 220 : 30;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  const engine = new SmartBrushEngine();
  engine.init({ width, height, data });

  const mask = new Uint8ClampedArray(width * height);

  // Paint with smart brush starting at x=32, y=40 with radius=16 (which would cross x=40 if unconstrained)
  engine.paintSmartBrush(mask, 32, 40, 32, 40, {
    radius: 16,
    hardness: 0.8,
    mode: 'paint',
    edgeSnap: 'HIGH'
  });

  // Pixels on the left side (x=30..38) should be painted
  assert.ok(mask[40 * width + 32] > 200, 'Center of stroke must be painted');
  assert.ok(mask[40 * width + 36] > 100, 'Left side up to boundary should be painted');

  // Pixels past the boundary on the right side (x=44) must NOT be painted because of edge barrier!
  assert.equal(mask[40 * width + 44], 0, 'Smart brush must not cross the strong vertical edge at x=40');
});

test('Mask Refinement fills pinholes, eliminates small islands, and respects protected regions', () => {
  const width = 60;
  const height = 60;
  const total = width * height;
  const data = new Uint8ClampedArray(total * 4).fill(150);

  const engine = new SmartBrushEngine();
  engine.init({ width, height, data });

  const mask = new Uint8ClampedArray(total);
  // Create a solid wall region 20..40 in x and y
  for (let y = 20; y <= 40; y++) {
    for (let x = 20; x <= 40; x++) {
      mask[y * width + x] = 255;
    }
  }

  // Inject a small 2x2 pinhole inside the mask at (28, 28)
  mask[28 * width + 28] = 0;
  mask[28 * width + 29] = 0;
  mask[29 * width + 28] = 0;
  mask[29 * width + 29] = 0;

  // Inject an isolated small island (3 pixels) far outside at (5, 5)
  mask[5 * width + 5] = 255;
  mask[5 * width + 6] = 255;
  mask[6 * width + 5] = 255;

  // Protected mask covering (20, 20)
  const protectedMask = new Uint8Array(total);
  protectedMask[20 * width + 20] = 1;

  const refined = engine.refineMask(mask, {
    holeClosingRadius: 2,
    minIslandPixels: 20,
    protectedMask
  });

  // Pinhole should be filled
  assert.equal(refined[28 * width + 28], 255, 'Pinhole at (28,28) should be filled');

  // Small island at (5,5) should be removed
  assert.equal(refined[5 * width + 5], 0, 'Isolated island should be eliminated');

  // Protected pixel must be strictly 0
  assert.equal(refined[20 * width + 20], 0, 'Protected pixel must be 0');
});
