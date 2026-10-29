import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeHex,
  parseHexToRgb,
  srgbToLinearChannel,
  linearToSrgbChannel,
  srgbToLinear,
  linearToSrgb,
  linearLuminance,
  linearRgbToOklab,
  oklabToLinearRgb,
  srgbToOklab,
  oklabToSrgb,
  getCachedTargetColor,
  clearTargetColorCache
} from '../src/utils/colorSpace.js';

test('normalizeHex handles 3-digit and 6-digit hex colors', () => {
  assert.strictEqual(normalizeHex('#fff'), '#FFFFFF');
  assert.strictEqual(normalizeHex('fff'), '#FFFFFF');
  assert.strictEqual(normalizeHex('#2563eb'), '#2563EB');
  assert.strictEqual(normalizeHex('2563EB'), '#2563EB');
  assert.strictEqual(normalizeHex('#000'), '#000000');
  assert.strictEqual(normalizeHex('invalid'), null);
  assert.strictEqual(normalizeHex(''), null);
  assert.strictEqual(normalizeHex(null), null);
  assert.strictEqual(normalizeHex(123456), null);
});

test('parseHexToRgb handles valid and fallback colors', () => {
  const white = parseHexToRgb('#ffffff');
  assert.deepStrictEqual(white, { r: 255, g: 255, b: 255, hex: '#FFFFFF' });

  const black = parseHexToRgb('#000');
  assert.deepStrictEqual(black, { r: 0, g: 0, b: 0, hex: '#000000' });

  const custom = parseHexToRgb('#2563EB');
  assert.deepStrictEqual(custom, { r: 37, g: 99, b: 235, hex: '#2563EB' });

  // Invalid fallback
  const fallback = parseHexToRgb('xyz', '#E8D9C5');
  assert.deepStrictEqual(fallback, { r: 232, g: 217, b: 197, hex: '#E8D9C5' });
});

test('sRGB <-> Linear RGB channel transfer function round-trip', () => {
  for (let c8 = 0; c8 <= 255; c8 += 5) {
    const lin = srgbToLinearChannel(c8);
    const roundTripped = linearToSrgbChannel(lin);
    assert.strictEqual(
      roundTripped,
      c8,
      `Channel ${c8} failed round-trip: got ${roundTripped}`
    );
  }
});

test('Linear sRGB <-> Oklab round-trip for primaries, secondaries, and neutrals', () => {
  const testColors = [
    { name: 'Black', r: 0, g: 0, b: 0 },
    { name: 'White', r: 255, g: 255, b: 255 },
    { name: '50% Gray', r: 128, g: 128, b: 128 },
    { name: 'Red', r: 255, g: 0, b: 0 },
    { name: 'Green', r: 0, g: 255, b: 0 },
    { name: 'Blue', r: 0, g: 0, b: 255 },
    { name: 'Cyan', r: 0, g: 255, b: 255 },
    { name: 'Magenta', r: 255, g: 0, b: 255 },
    { name: 'Yellow', r: 255, g: 255, b: 0 },
    { name: 'Warm Ivory (#F4EBDD)', r: 244, g: 235, b: 221 },
    { name: 'Hale Navy (#1A2B4C)', r: 26, g: 43, b: 76 },
    { name: 'Terracotta (#C85A32)', r: 200, g: 90, b: 50 },
    { name: 'Sage Green (#7A9A7B)', r: 122, g: 154, b: 123 }
  ];

  for (const { name, r, g, b } of testColors) {
    const oklab = srgbToOklab({ r, g, b });
    const srgbOut = oklabToSrgb(oklab);

    // Delta tolerance: within 1 level of 8-bit quantization
    const deltaR = Math.abs(srgbOut.r - r);
    const deltaG = Math.abs(srgbOut.g - g);
    const deltaB = Math.abs(srgbOut.b - b);

    assert.ok(
      deltaR <= 1 && deltaG <= 1 && deltaB <= 1,
      `${name} round-trip error too large: in=(${r},${g},${b}), out=(${srgbOut.r},${srgbOut.g},${srgbOut.b})`
    );
  }
});

test('Oklab preserves relative lightness ordering', () => {
  const darkNavy = srgbToOklab({ r: 26, g: 43, b: 76 });
  const midGray = srgbToOklab({ r: 128, g: 128, b: 128 });
  const lightIvory = srgbToOklab({ r: 244, g: 235, b: 221 });

  assert.ok(darkNavy.L < midGray.L, 'Dark navy should have lower Oklab L than mid gray');
  assert.ok(midGray.L < lightIvory.L, 'Mid gray should have lower Oklab L than light ivory');
});

test('getCachedTargetColor precomputes and manages cache capacity', () => {
  clearTargetColorCache();
  const c1 = getCachedTargetColor('#2563EB');
  assert.strictEqual(c1.hex, '#2563EB');
  assert.strictEqual(c1.rgb.r, 37);

  // Cached retrieval
  const c2 = getCachedTargetColor('#2563EB');
  assert.strictEqual(c1, c2, 'Cached instance should be reused');

  // Fill cache beyond limit
  for (let i = 0; i < 70; i++) {
    const hex = '#' + i.toString(16).padStart(6, '0');
    getCachedTargetColor(hex);
  }
  // Cache size should remain bounded at 64
  clearTargetColorCache();
});
