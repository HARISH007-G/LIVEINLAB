import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeMaskRLE, decodeMaskRLE, validateVannamProject } from '../src/utils/maskSerializer.js';

test('encodeMaskRLE and decodeMaskRLE perform lossless compression on high-resolution masks', () => {
  const width = 1600;
  const height = 1200;
  const total = width * height;
  const originalMask = new Uint8ClampedArray(total);

  // Simulate a realistic room wall covering (x: 200..1400, y: 150..1050)
  for (let y = 150; y <= 1050; y++) {
    for (let x = 200; x <= 1400; x++) {
      originalMask[y * width + x] = 255;
    }
  }

  // Measure RLE encoding
  const rle = encodeMaskRLE(originalMask);
  assert.ok(rle.runs.length < 5000, `RLE runs (${rle.runs.length}) should be dramatically smaller than 1.92M`);
  assert.equal(rle.length, total);

  // Lossless decode
  const restoredMask = decodeMaskRLE(rle);
  assert.equal(restoredMask.length, total);

  // Verify byte-for-byte exact equality
  for (let i = 0; i < total; i++) {
    if (originalMask[i] !== restoredMask[i]) {
      assert.fail(`Mismatch at index ${i}: expected ${originalMask[i]}, got ${restoredMask[i]}`);
    }
  }
});

test('decodeMaskRLE gracefully handles legacy raw array format', () => {
  const legacyArray = [0, 0, 255, 255, 0];
  const decoded = decodeMaskRLE(legacyArray);
  assert.ok(decoded instanceof Uint8ClampedArray);
  assert.deepEqual(Array.from(decoded), legacyArray);
});

test('validateVannamProject detects valid and corrupted schemas', () => {
  const valid = {
    app: 'VANNAM',
    version: '2.5',
    surfaces: [
      { id: 's1', name: 'Main Wall', color: '#F4EBDD' }
    ]
  };
  const valResult = validateVannamProject(valid);
  assert.equal(valResult.valid, true);

  const missingApp = { version: '2.5', surfaces: [] };
  assert.equal(validateVannamProject(missingApp).valid, false);

  const corruptedSurfaces = { app: 'VANNAM', surfaces: 'not-an-array' };
  assert.equal(validateVannamProject(corruptedSurfaces).valid, false);

  const invalidSurfaceItem = { app: 'VANNAM', surfaces: [{ missingId: true }] };
  assert.equal(validateVannamProject(invalidSurfaceItem).valid, false);
});
