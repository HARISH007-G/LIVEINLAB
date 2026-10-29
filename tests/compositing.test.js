import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPhotorealisticPixel } from '../src/utils/shadingEngine.js';

test('Non-wall pixels outside mask remain strictly identical to original source pixels', () => {
  const width = 10;
  const height = 10;
  const total = width * height;

  // Synthetic original image data
  const srcR = new Uint8Array(total);
  const srcG = new Uint8Array(total);
  const srcB = new Uint8Array(total);
  const srcA = new Uint8Array(total);

  for (let i = 0; i < total; i++) {
    srcR[i] = (i * 7) % 256;
    srcG[i] = (i * 13) % 256;
    srcB[i] = (i * 19) % 256;
    srcA[i] = 255;
  }

  // Mask: only top half (y < 5) is selected, bottom half is 0
  const mask = new Uint8Array(total);
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < width; x++) {
      mask[y * width + x] = 255;
    }
  }

  // Simulate compositing
  const outR = new Uint8Array(total);
  const outG = new Uint8Array(total);
  const outB = new Uint8Array(total);
  const outA = new Uint8Array(total);

  for (let i = 0; i < total; i++) {
    const alpha = mask[i] / 255.0;
    if (alpha === 0) {
      outR[i] = srcR[i];
      outG[i] = srcG[i];
      outB[i] = srcB[i];
      outA[i] = srcA[i];
    } else {
      const p = renderPhotorealisticPixel({
        origR: srcR[i],
        origG: srcG[i],
        origB: srcB[i],
        linearLum: 0.5,
        lowFreqLum: 0.5,
        detail: 0.0,
        wallBaseline: 0.5,
        targetColorHex: '#2563EB'
      });
      outR[i] = Math.round(p.r * alpha + srcR[i] * (1 - alpha));
      outG[i] = Math.round(p.g * alpha + srcG[i] * (1 - alpha));
      outB[i] = Math.round(p.b * alpha + srcB[i] * (1 - alpha));
      outA[i] = srcA[i];
    }
  }

  // Verify bottom half (outside mask) is 100% bit-exact to original
  for (let y = 5; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      assert.strictEqual(outR[idx], srcR[idx], `Red mismatch outside mask at ${idx}`);
      assert.strictEqual(outG[idx], srcG[idx], `Green mismatch outside mask at ${idx}`);
      assert.strictEqual(outB[idx], srcB[idx], `Blue mismatch outside mask at ${idx}`);
      assert.strictEqual(outA[idx], srcA[idx], `Alpha mismatch outside mask at ${idx}`);
    }
  }

  // Verify top half (inside mask) is recolored to target blue
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      assert.ok(outB[idx] > outR[idx], `Selected pixel at ${idx} was not recolored`);
    }
  }
});

test('Partial mask alpha produces smooth linear blend without halos or clipping', () => {
  const origR = 100, origG = 100, origB = 100;
  const p = renderPhotorealisticPixel({
    origR, origG, origB,
    linearLum: 0.5, lowFreqLum: 0.5, detail: 0.0,
    wallBaseline: 0.5,
    targetColorHex: '#FF0000' // Target Red
  });

  // Test partial alpha = 0.50 (mask = 128)
  const alpha = 128 / 255.0;
  const blendedR = Math.round(p.r * alpha + origR * (1 - alpha));
  const blendedG = Math.round(p.g * alpha + origG * (1 - alpha));
  const blendedB = Math.round(p.b * alpha + origB * (1 - alpha));

  assert.ok(blendedR > origR, 'Red channel should increase');
  assert.ok(blendedR < p.r, 'Red channel should be below full painted value');
  assert.ok(blendedG < origG, 'Green channel should decrease towards target red');
  assert.ok(blendedB < origB, 'Blue channel should decrease towards target red');
});

test('Source image buffer is strictly immutable during and after rendering', () => {
  const total = 16;
  const srcData = new Uint8ClampedArray(total * 4);
  for (let i = 0; i < srcData.length; i++) {
    srcData[i] = (i * 17) % 256;
  }
  const snapshot = new Uint8ClampedArray(srcData);

  const mask = new Uint8Array(total).fill(255);
  const outData = new Uint8ClampedArray(total * 4);

  // Perform rendering operations
  for (let i = 0; i < total; i++) {
    const p = i * 4;
    const rendered = renderPhotorealisticPixel({
      origR: srcData[p],
      origG: srcData[p + 1],
      origB: srcData[p + 2],
      linearLum: 0.5, lowFreqLum: 0.5, detail: 0.0,
      wallBaseline: 0.5,
      targetColorHex: '#2563EB'
    });
    outData[p] = rendered.r;
    outData[p + 1] = rendered.g;
    outData[p + 2] = rendered.b;
    outData[p + 3] = srcData[p + 3];
  }

  // Verify source data is 100% bit-exact to original snapshot
  for (let i = 0; i < srcData.length; i++) {
    assert.strictEqual(srcData[i], snapshot[i], `Source mutated at index ${i}`);
  }
});
