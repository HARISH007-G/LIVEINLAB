import test from 'node:test';
import assert from 'node:assert/strict';
import { IndoorSegmentationEngine, SEMANTIC_CLASSES } from '../src/utils/indoorSegmentationEngine.js';

test('IndoorSegmentationEngine partitions two adjacent walls separated by a corner crease', async () => {
  const width = 120;
  const height = 100;
  const total = width * height;
  const data = new Uint8ClampedArray(total * 4);

  // Generate synthetic room:
  // - Top 10%: Ceiling (light 220)
  // - Bottom 15%: Dark floor (30)
  // - Center left (x < 60): Left wall (180)
  // - Center right (x >= 60): Right wall (140, creates corner crease at x=60)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let val = 160;
      if (y < 10) val = 220;
      else if (y > 85) val = 30;
      else if (x < 60) val = 180;
      else val = 140;

      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  const engine = new IndoorSegmentationEngine();
  const result = await engine.segmentScene({ width, height, data });

  assert.ok(result.surfaces.length >= 2, 'Should detect at least 2 distinct wall surfaces');
  assert.equal(result.surfaces[0].type, 'main-wall');
  assert.equal(result.surfaces[1].type, 'accent-wall');

  // Floor pixels at y=95 should be in protectedMask
  const floorIdx = 95 * width + 50;
  assert.equal(result.protectedMask[floorIdx], 1, 'Floor should be marked in protectedMask');
});

test('IndoorSegmentationEngine provides robust fallback when scene has flat lighting', async () => {
  const width = 60;
  const height = 60;
  const total = width * height;
  const data = new Uint8ClampedArray(total * 4).fill(160);

  const engine = new IndoorSegmentationEngine();
  const result = await engine.segmentScene({ width, height, data });

  assert.ok(result.surfaces.length >= 1, 'Fallback must always produce at least one surface');
  assert.ok(result.surfaces[0].mask instanceof Uint8ClampedArray, 'Mask must be Uint8ClampedArray');
  assert.equal(result.surfaces[0].name, 'Main Wall');
});
