import test from 'node:test';
import assert from 'node:assert/strict';
import { createPaintEngine } from '../src/utils/advancedPaintEngine.js';

test('Multi-Wall recoloring allows independent colors and finishes on adjacent walls', async () => {
  const width = 100;
  const height = 100;
  const total = width * height;
  const data = new Uint8ClampedArray(total * 4).fill(160);
  for (let i = 0; i < total; i++) data[i * 4 + 3] = 255;

  const fakeImg = {
    naturalWidth: width,
    naturalHeight: height,
    width,
    height
  };

  const engine = createPaintEngine();

  // Create mock canvas
  const canvas = {
    width,
    height,
    getContext: () => ({
      drawImage: () => {},
      getImageData: () => ({ width, height, data: new Uint8ClampedArray(data) }),
      createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
      putImageData: (imgData) => {
        canvas._lastOutput = imgData;
      },
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      arc: () => {},
      fill: () => {},
      rect: () => {}
    })
  };

  // Mock global document.createElement for node test environment
  global.document = {
    createElement: () => canvas
  };

  await engine.loadImage(fakeImg);

  // Surface 1: Left wall (x: 10..45, y: 10..90) -> RED (#FF0000)
  const mask1 = new Uint8ClampedArray(total);
  for (let y = 10; y <= 90; y++) {
    for (let x = 10; x <= 45; x++) {
      mask1[y * width + x] = 255;
    }
  }

  // Surface 2: Right wall (x: 55..90, y: 10..90) -> BLUE (#0000FF)
  const mask2 = new Uint8ClampedArray(total);
  for (let y = 10; y <= 90; y++) {
    for (let x = 55; x <= 90; x++) {
      mask2[y * width + x] = 255;
    }
  }

  const surfaces = [
    {
      id: 'wall-left',
      name: 'Main Wall',
      type: 'main-wall',
      mask: mask1,
      color: '#FF0000',
      finish: 'matte'
    },
    {
      id: 'wall-right',
      name: 'Accent Wall',
      type: 'accent-wall',
      mask: mask2,
      color: '#0000FF',
      finish: 'satin'
    }
  ];

  engine.renderComposite({
    targetCanvas: canvas,
    surfaces,
    comparisonMode: 'after'
  });

  const out = canvas._lastOutput.data;

  // Check left wall center pixel (x=25, y=50) -> Red channel must dominate Blue
  const pLeft = (50 * width + 25) * 4;
  assert.ok(out[pLeft] > out[pLeft + 2], 'Left wall must be predominantly red');

  // Check right wall center pixel (x=70, y=50) -> Blue channel must dominate Red
  const pRight = (50 * width + 70) * 4;
  assert.ok(out[pRight + 2] > out[pRight], 'Right wall must be predominantly blue');

  // Check untouched center strip (x=50, y=50) -> Should remain original neutral gray (160)
  const pMid = (50 * width + 50) * 4;
  assert.equal(out[pMid], 160, 'Untouched strip must remain original source color');
  assert.equal(out[pMid + 1], 160);
  assert.equal(out[pMid + 2], 160);
});
