/**
 * VANNAM Perceptual Color Science Module
 * 
 * Standards-compliant, mathematically rigorous implementations:
 * - sRGB <-> Linear RGB transfer functions (IEC 61966-2-1) with 4KB L1-cache LUTs
 * - Linear sRGB <-> Oklab (Björn Ottosson, 2020)
 * - CIE D65 reference white
 * - Robust hexadecimal parser & validator with bounded LRU cache
 */

// Precomputed 256-entry sRGB [0, 255] -> Linear [0, 1] Float32 LUT
export const SRGB_TO_LINEAR_LUT = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255.0;
  SRGB_TO_LINEAR_LUT[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Precomputed 4096-entry Linear [0, 1] -> 8-bit sRGB Uint8 LUT (4KB fits in CPU L1 cache)
export const LINEAR_TO_SRGB_LUT = new Uint8Array(4096);
for (let i = 0; i < 4096; i++) {
  const c = i / 4095.0;
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055;
  LINEAR_TO_SRGB_LUT[i] = Math.round(Math.max(0, Math.min(255, s * 255.0)));
}

/**
 * Fast lookup for 8-bit sRGB to linear-light [0, 1].
 */
export function fastSrgbToLinear(c8) {
  return SRGB_TO_LINEAR_LUT[c8 & 255];
}

/**
 * Fast lookup for linear-light [0, 1] to 8-bit sRGB [0, 255].
 */
export function fastLinearToSrgb(cLin) {
  if (cLin <= 0) return 0;
  if (cLin >= 1) return 255;
  return LINEAR_TO_SRGB_LUT[(cLin * 4095.0) | 0];
}

// Bounded cache for precomputed target colors (max 64 entries)
const TARGET_COLOR_CACHE = new Map();
const MAX_CACHE_ENTRIES = 64;

/**
 * Validates and normalizes hexadecimal color input.
 * Supports #RRGGBB and #RGB (with or without #).
 * Returns normalized uppercase 6-char hex string (e.g., '#2563EB').
 * Returns null for invalid inputs.
 */
export function normalizeHex(hex) {
  if (typeof hex !== 'string') return null;
  const clean = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return '#' + clean.toUpperCase();
  }
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return '#' + clean.split('').map(c => c + c).join('').toUpperCase();
  }
  return null;
}

/**
 * Parse hex string to 8-bit sRGB [0, 255].
 * If invalid, uses fallback (#F4EBDD architectural ivory).
 */
export function parseHexToRgb(hex, fallback = '#F4EBDD') {
  const validHex = normalizeHex(hex) || normalizeHex(fallback) || '#F4EBDD';
  const num = parseInt(validHex.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    hex: validHex
  };
}

/**
 * Convert 8-bit RGB channels to uppercase 6-char hex string (e.g. #2563EB).
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

/**
 * Convert 8-bit sRGB channel [0, 255] to linear-light [0, 1].
 * IEC 61966-2-1 standard transfer function.
 */
export function srgbToLinearChannel(c8) {
  const c = Math.max(0, Math.min(255, c8)) / 255.0;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear-light channel [0, 1] to 8-bit sRGB [0, 255].
 * Includes clamping for out-of-gamut values.
 */
export function linearToSrgbChannel(cLin) {
  const c = Math.max(0, Math.min(1, cLin));
  const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1.0 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, s * 255.0)));
}

/**
 * Convert 8-bit sRGB { r, g, b } to Linear RGB { r, g, b } [0, 1].
 */
export function srgbToLinear({ r, g, b }) {
  return {
    r: SRGB_TO_LINEAR_LUT[r & 255],
    g: SRGB_TO_LINEAR_LUT[g & 255],
    b: SRGB_TO_LINEAR_LUT[b & 255]
  };
}

/**
 * Convert Linear RGB { r, g, b } [0, 1] to 8-bit sRGB { r, g, b } [0, 255].
 */
export function linearToSrgb({ r, g, b }) {
  return {
    r: fastLinearToSrgb(r),
    g: fastLinearToSrgb(g),
    b: fastLinearToSrgb(b)
  };
}

/**
 * Calculate standard linear relative luminance (Rec. 709 / sRGB coefficients).
 */
export function linearLuminance(rLin, gLin, bLin) {
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Convert Linear sRGB to Oklab (Björn Ottosson, 2020).
 * Input: r, g, b in [0, 1]
 * Output: { L, a, b } where L in [0, 1], a & b roughly in [-0.4, 0.4]
 */
export function linearRgbToOklab({ r, g, b }) {
  // Linear RGB to LMS
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // Non-linear cube root response
  const l_ = Math.cbrt(Math.max(0, l));
  const m_ = Math.cbrt(Math.max(0, m));
  const s_ = Math.cbrt(Math.max(0, s));

  // LMS to Oklab
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  return { L, a, b: b_ };
}

/**
 * Convert Oklab to Linear sRGB.
 * Input: { L, a, b }
 * Output: { r, g, b } in [0, 1] (gamut-clamped)
 */
export function oklabToLinearRgb({ L, a, b }) {
  // Oklab to LMS cube roots
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  // Cube
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS to Linear RGB
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bLin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Clamp gamut to [0, 1]
  return {
    r: Math.max(0, Math.min(1, r)),
    g: Math.max(0, Math.min(1, g)),
    b: Math.max(0, Math.min(1, bLin))
  };
}

/**
 * Direct sRGB [0, 255] to Oklab
 */
export function srgbToOklab(rgb255) {
  const lin = srgbToLinear(rgb255);
  return linearRgbToOklab(lin);
}

/**
 * Direct Oklab to sRGB [0, 255]
 */
export function oklabToSrgb(oklab) {
  const lin = oklabToLinearRgb(oklab);
  return linearToSrgb(lin);
}

/**
 * Precompute and cache comprehensive representations of a target paint color.
 * Reuses results across millions of pixel iterations.
 */
export function getCachedTargetColor(hex) {
  const validHex = normalizeHex(hex) || '#F4EBDD';
  if (TARGET_COLOR_CACHE.has(validHex)) {
    return TARGET_COLOR_CACHE.get(validHex);
  }

  const rgb = parseHexToRgb(validHex);
  const rgbLinear = srgbToLinear(rgb);
  const oklab = linearRgbToOklab(rgbLinear);
  const luminanceLin = linearLuminance(rgbLinear.r, rgbLinear.g, rgbLinear.b);

  const entry = {
    hex: validHex,
    rgb,
    rgbLinear,
    oklab,
    luminanceLinear: luminanceLin
  };

  // Manage cache capacity
  if (TARGET_COLOR_CACHE.size >= MAX_CACHE_ENTRIES) {
    const firstKey = TARGET_COLOR_CACHE.keys().next().value;
    TARGET_COLOR_CACHE.delete(firstKey);
  }
  TARGET_COLOR_CACHE.set(validHex, entry);

  return entry;
}

/**
 * Clear precomputed color cache.
 */
export function clearTargetColorCache() {
  TARGET_COLOR_CACHE.clear();
}
