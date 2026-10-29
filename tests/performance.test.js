import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ShadingDecompositionCache,
  renderPhotorealisticPixelFast,
  FINISH_MODES
} from '../src/utils/shadingEngine.js';
import { getCachedTargetColor } from '../src/utils/colorSpace.js';

test('Performance benchmark on 1600x1200 high-resolution photograph fixture', () => {
  const width = 1600;
  const height = 1200;
  const total = width * height;

  // Generate synthetic 1600x1200 room photo with room gradient and texture
  const fakeImageData = {
    width,
    height,
    data: new Uint8ClampedArray(total * 4)
  };

  const data = fakeImageData.data;
  for (let y = 0; y < height; y++) {
    const yFactor = y / height;
    for (let x = 0; x < width; x++) {
      const xFactor = x / width;
      const idx = y * width + x;
      const p = idx * 4;
      // Room gradient + subtle surface noise
      const baseLum = 120 + Math.round(60 * (1 - yFactor) + 40 * xFactor);
      const grain = ((x * 17 + y * 31) % 13) - 6;
      const val = Math.max(0, Math.min(255, baseLum + grain));
      data[p] = val;
      data[p + 1] = val;
      data[p + 2] = val;
      data[p + 3] = 255;
    }
  }

  // Measure initial decomposition pass
  const cache = new ShadingDecompositionCache();
  const startDecomp = performance.now();
  cache.ensureDecomposition(fakeImageData, width, height, 16);
  const decompTimeMs = performance.now() - startDecomp;

  assert.ok(decompTimeMs < 450, `Decomposition took too long: ${decompTimeMs}ms`);

  // Measure full-frame photorealistic rendering pass (1.92 million pixels)
  const mask = new Uint8Array(total).fill(255);
  const wallBaseline = cache.getWallBaseline('s1', mask);
  const target = getCachedTargetColor('#2563EB');
  const finishConfig = FINISH_MODES.satin;

  // 1. Initial cold render pass (1.92 million pixels)
  const outData = new Uint8ClampedArray(total * 4);
  const linLum = cache.linearLuminance;
  const lowFreq = cache.illuminationField;
  const detail = cache.detailField;

  const startFirstRender = performance.now();
  for (let i = 0; i < total; i++) {
    const p = i * 4;
    const rendered = renderPhotorealisticPixelFast(
      data[p], data[p + 1], data[p + 2],
      linLum[i], lowFreq[i], detail[i],
      wallBaseline,
      target, finishConfig,
      0.85, 0.25, 1.0
    );
    outData[p] = rendered.r;
    outData[p + 1] = rendered.g;
    outData[p + 2] = rendered.b;
    outData[p + 3] = 255;
  }
  const firstRenderTimeMs = performance.now() - startFirstRender;

  // 2. Subsequent live recoloring pass (swapping to a new red swatch #DC2626)
  const targetColor2 = getCachedTargetColor('#DC2626');
  const startSubsequentRender = performance.now();
  for (let i = 0; i < total; i++) {
    const p = i * 4;
    const rendered = renderPhotorealisticPixelFast(
      data[p], data[p + 1], data[p + 2],
      linLum[i], lowFreq[i], detail[i],
      wallBaseline,
      targetColor2, finishConfig,
      0.85, 0.25, 1.0
    );
    outData[p] = rendered.r;
    outData[p + 1] = rendered.g;
    outData[p + 2] = rendered.b;
  }
  const subsequentRecolorTimeMs = performance.now() - startSubsequentRender;

  // 3. Typical single-wall recolor (50% of pixels covered by wall plane)
  const maskedOut = new Uint8ClampedArray(total);
  const startMaskedRecolor = performance.now();
  for (let i = 0; i < total; i += 2) {
    const p = i * 4;
    const rendered = renderPhotorealisticPixelFast(
      data[p], data[p + 1], data[p + 2],
      linLum[i], lowFreq[i], detail[i],
      wallBaseline,
      targetColor2, finishConfig,
      0.85, 0.25, 1.0
    );
    maskedOut[i] = rendered.r;
  }
  const maskedRecolorTimeMs = performance.now() - startMaskedRecolor;

  console.log(`\n--- BENCHMARK RESULTS (1600x1200 = 1,920,000 pixels) ---`);
  console.log(`Decomposition Pass (Separable low-pass + detail): ${decompTimeMs.toFixed(2)} ms`);
  console.log(`Initial Full-Frame Photorealistic Render: ${firstRenderTimeMs.toFixed(2)} ms`);
  console.log(`Total First-Frame Budget: ${(decompTimeMs + firstRenderTimeMs).toFixed(2)} ms`);
  console.log(`Subsequent Live Recolor (Full-Frame 100%): ${subsequentRecolorTimeMs.toFixed(2)} ms`);
  console.log(`Subsequent Wall Recolor (~50% surface plane): ${maskedRecolorTimeMs.toFixed(2)} ms\n`);

  assert.ok(firstRenderTimeMs < 350, `Initial render took too long: ${firstRenderTimeMs}ms`);
  assert.ok(subsequentRecolorTimeMs < 300, `Subsequent recolor took too long: ${subsequentRecolorTimeMs}ms`);
  assert.ok(outData[0] > outData[2], 'Result must be recolored with second target');
});
