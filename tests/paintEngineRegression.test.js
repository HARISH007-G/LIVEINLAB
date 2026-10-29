import test from 'node:test';
import assert from 'node:assert/strict';
import { createPaintEngine, hexToRgb, rgbToHex, calculateLuminance, clamp } from '../src/utils/advancedPaintEngine.js';

// Setup minimal Canvas & Image mocks for Node test environment
function setupNodeCanvasMock() {
  globalThis.document = {
    createElement(tag) {
      if (tag === 'canvas') {
        const ctx = {
          drawImage() {},
          getImageData(x, y, w, h) {
            return {
              width: w,
              height: h,
              data: new Uint8ClampedArray(w * h * 4).fill(160)
            };
          },
          createImageData(w, h) {
            return {
              width: w,
              height: h,
              data: new Uint8ClampedArray(w * h * 4)
            };
          },
          putImageData(imgData) {
            this.lastPut = imgData;
          },
          save() {},
          restore() {},
          beginPath() {},
          stroke() {},
          rect() {},
          fill() {},
          arc() {},
          moveTo() {},
          lineTo() {},
          fillText() {}
        };
        return {
          width: 0,
          height: 0,
          getContext(type) {
            return ctx;
          }
        };
      }
      return {};
    }
  };
}

test('Utility helpers: hexToRgb, rgbToHex, calculateLuminance, clamp', () => {
  assert.deepStrictEqual(hexToRgb('#2563EB'), { r: 37, g: 99, b: 235 });
  assert.deepStrictEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
  assert.strictEqual(rgbToHex(37, 99, 235), '#2563EB');
  assert.strictEqual(clamp(300, 0, 255), 255);
  assert.strictEqual(clamp(-10, 0, 255), 0);
  assert.strictEqual(clamp(120, 0, 255), 120);
  assert.strictEqual(Math.round(calculateLuminance(255, 255, 255)), 255);
});

test('createPaintEngine initializes and executes photorealistic renderComposite', async () => {
  setupNodeCanvasMock();

  const engine = createPaintEngine();
  assert.ok(engine, 'Engine must instantiate');

  const mockImage = {
    width: 64,
    height: 64,
    naturalWidth: 64,
    naturalHeight: 64
  };

  const loaded = await engine.loadImage(mockImage);
  assert.strictEqual(loaded.workingWidth, 64);
  assert.strictEqual(loaded.workingHeight, 64);

  const targetCanvas = document.createElement('canvas');
  const targetCtx = targetCanvas.getContext('2d');

  const mockMask = new Uint8Array(64 * 64).fill(255);
  const surfaces = [
    {
      id: 'surface_01',
      name: 'Main Wall Plane',
      color: '#2563EB',
      finish: 'matte',
      mask: mockMask,
      lightingPreservation: 0.85,
      texturePreservation: 0.25
    }
  ];

  // 1. Render in Photorealistic mode
  engine.renderComposite({
    targetCanvas,
    surfaces,
    renderingStrategy: 'photorealistic'
  });

  assert.ok(targetCtx.lastPut, 'Render output must be committed to target canvas');
  const outData = targetCtx.lastPut.data;
  // Selected pixel should be tinted to royal blue (B > R and B > G)
  assert.ok(outData[2] > outData[0], 'Photorealistic mode recolored surface to blue');

  // 2. Render in Legacy fallback mode
  engine.renderComposite({
    targetCanvas,
    surfaces,
    renderingStrategy: 'legacy'
  });
  assert.ok(targetCtx.lastPut, 'Legacy output committed to target canvas');

  // 3. Test brush stroke on surface
  engine.drawBrushStrokeOnSurface(surfaces[0], 10, 10, 20, 20, 10, 0.5, 'erase');
  assert.strictEqual(surfaces[0].mask[10 * 64 + 10], 0, 'Erase brush cleared surface mask pixel');

  // 4. Cleanup
  engine.destroy();
  assert.strictEqual(engine.getProtectedMask(), null);
});
