/**
 * VANNAM Architectural Color Harmonizer (60-30-10 Rule)
 * Analyzes any selected base paint shade and computes:
 * - 60% Dominant Base (Primary Wall Surface)
 * - 30% Secondary Harmony (Adjacent Walls, Baseboards, Ceiling)
 * - 10% Accent Pop (Feature Pillars, Window Trims, Architectural Details)
 */

import { hexToRgb } from './advancedPaintEngine';
import { curatedPaintDatabase } from '../data/paintDatabase';

// RGB to HSL
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

// HSL to HEX
export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Find closest curated paint shade from database by color distance
 */
export function findClosestPaint(hex) {
  const target = hexToRgb(hex);
  let bestMatch = curatedPaintDatabase[0];
  let minDistance = Infinity;

  for (const paint of curatedPaintDatabase) {
    const current = hexToRgb(paint.hex);
    const dist = Math.sqrt(
      Math.pow(target.r - current.r, 2) * 0.3 +
      Math.pow(target.g - current.g, 2) * 0.59 +
      Math.pow(target.b - current.b, 2) * 0.11
    );
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = paint;
    }
  }
  return bestMatch;
}

/**
 * Generate 60-30-10 Architectural Palette from Base Color
 * @param {string} baseHex - e.g. '#F4EBDD'
 * @param {string} baseName - e.g. 'Warm Ivory'
 * @returns {object} { dominant, secondary, accent }
 */
export function generateArchitecturalPalette(baseHex, baseName = 'Selected Base') {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // 1. Dominant 60% (Base Wall)
  const dominant = {
    role: 'Dominant (60%)',
    roleDesc: 'Main Wall Surfaces & Open Spaces',
    name: baseName,
    hex: baseHex.toUpperCase(),
    percent: 60
  };

  // 2. Secondary 30% (Harmonious analogous tone with soft lightness balance)
  const secondaryHue = (hsl.h + 18) % 360;
  const secondarySat = Math.max(8, hsl.s - 6);
  const secondaryLight = hsl.l > 50 ? Math.max(20, hsl.l - 18) : Math.min(85, hsl.l + 22);
  const secondaryHex = hslToHex(secondaryHue, secondarySat, secondaryLight);
  const secondaryMatch = findClosestPaint(secondaryHex);

  const secondary = {
    role: 'Secondary (30%)',
    roleDesc: 'Adjacent Walls, Ceilings & Recesses',
    name: secondaryMatch ? secondaryMatch.name : 'Complementary Tone',
    brand: secondaryMatch ? secondaryMatch.brand : 'Curated Mix',
    code: secondaryMatch ? secondaryMatch.code : 'V-SEC',
    hex: secondaryHex,
    percent: 30
  };

  // 3. Accent 10% (High-contrast architectural pop, complementary angle)
  const accentHue = (hsl.h + 175) % 360;
  const accentSat = Math.min(85, hsl.s + 15);
  const accentLight = hsl.l > 50 ? Math.max(15, hsl.l - 35) : Math.min(88, hsl.l + 35);
  const accentHex = hslToHex(accentHue, accentSat, accentLight);
  const accentMatch = findClosestPaint(accentHex);

  const accent = {
    role: 'Accent (10%)',
    roleDesc: 'Feature Pillars, Window Frames & Trim',
    name: accentMatch ? accentMatch.name : 'Architectural Accent',
    brand: accentMatch ? accentMatch.brand : 'Curated Mix',
    code: accentMatch ? accentMatch.code : 'V-ACC',
    hex: accentHex,
    percent: 10
  };

  return {
    dominant,
    secondary,
    subordinate: secondary,
    accent
  };
}
