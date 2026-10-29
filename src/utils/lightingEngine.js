/**
 * VANNAM Lighting Engine
 * Simulates real-world architectural lighting conditions (Kelvin color temperatures,
 * ambient shadows, directional sun angles, and warm/cool shifts).
 */

export const LIGHTING_PRESETS = {
  morning: {
    id: 'morning',
    name: 'Morning Sunrise',
    time: '08:00 AM',
    kelvin: '5500K',
    temperature: 5500,
    intensity: 0.9,
    warmth: 0.08,
    shadowStrength: 0.8,
    tintR: 12,
    tintG: 6,
    tintB: -8
  },
  midday: {
    id: 'midday',
    name: 'Midday Sunlight',
    time: '12:00 PM',
    kelvin: '6500K',
    temperature: 6500,
    intensity: 1.05,
    warmth: 0.0,
    shadowStrength: 0.65,
    tintR: 0,
    tintG: 0,
    tintB: 4
  },
  goldenHour: {
    id: 'goldenHour',
    name: 'Golden Hour',
    time: '05:30 PM',
    kelvin: '3000K',
    temperature: 3000,
    intensity: 0.95,
    warmth: 0.38,
    shadowStrength: 1.15,
    tintR: 36,
    tintG: 18,
    tintB: -25
  },
  evening: {
    id: 'evening',
    name: 'Interior Ambient LED',
    time: '08:30 PM',
    kelvin: '2700K',
    temperature: 2700,
    intensity: 0.82,
    warmth: 0.48,
    shadowStrength: 0.95,
    tintR: 40,
    tintG: 22,
    tintB: -30
  }
};

export function getLightingPreset(key) {
  if (!key) return LIGHTING_PRESETS.midday;
  if (typeof key === 'object') return key;
  return LIGHTING_PRESETS[key] || LIGHTING_PRESETS.midday;
}

/**
 * Apply Lighting Transformation to RGB values
 * @param {{r: number, g: number, b: number}} rgb - Source RGB
 * @param {object} lighting - Lighting preset or custom params
 * @param {number} ambientLum - Pixel original luminance (0-1)
 * @returns {{r: number, g: number, b: number}}
 */
export function applyLightingToPixel(rgb, lighting, ambientLum = 0.5) {
  let { r, g, b } = rgb;
  const intensity = lighting.intensity || 1.0;
  const warmth = lighting.warmth || 0.0;

  // Temperature color shift
  r += (lighting.tintR || 0) * (1 - ambientLum * 0.3);
  g += (lighting.tintG || 0) * (1 - ambientLum * 0.3);
  b += (lighting.tintB || 0) * (1 - ambientLum * 0.3);

  // Warmth expansion
  if (warmth > 0) {
    r += warmth * 35 * ambientLum;
    g += warmth * 18 * ambientLum;
    b -= warmth * 28 * ambientLum;
  }

  // Shadow and intensity scaling
  const shadowFactor = Math.pow(ambientLum, (lighting.shadowStrength || 1.0) * 0.85);
  r = r * intensity * shadowFactor;
  g = g * intensity * shadowFactor;
  b = b * intensity * shadowFactor;

  return {
    r: Math.max(0, Math.min(255, Math.round(r))),
    g: Math.max(0, Math.min(255, Math.round(g))),
    b: Math.max(0, Math.min(255, Math.round(b)))
  };
}

/**
 * Convert time string (06:00 to 22:00) into dynamic lighting configuration
 * @param {number} hourFloat - e.g. 8.5 for 8:30 AM
 */
export function getLightingForHour(hourFloat) {
  if (hourFloat < 10) {
    return LIGHTING_PRESETS.morning;
  } else if (hourFloat < 16) {
    return LIGHTING_PRESETS.midday;
  } else if (hourFloat < 19) {
    return LIGHTING_PRESETS.goldenHour;
  } else {
    return LIGHTING_PRESETS.evening;
  }
}
