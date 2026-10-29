/**
 * VANNAM Texture & Sheen Engine
 * Simulates real-world architectural paint finishes:
 * - Ultra Matte (diffusion, velvety absorption)
 * - Satin / Eggshell (soft specular sheen)
 * - High Gloss (sharp highlights on luminance crests)
 * - Venetian Stucco (micro-bump grain, marble plaster depth)
 */

export const FINISH_PRESETS = {
  matte: {
    id: 'matte',
    name: 'Ultra Matte',
    sheen: 5,
    roughness: 0.95,
    specular: 0.05,
    grainStrength: 0.02,
    description: 'Flat, non-reflective velvety finish that conceals surface imperfections.'
  },
  satin: {
    id: 'satin',
    name: 'Satin / Eggshell',
    sheen: 25,
    roughness: 0.65,
    specular: 0.25,
    grainStrength: 0.04,
    description: 'Soft pearlescent luster with gentle specular diffusion along room light gradients.'
  },
  gloss: {
    id: 'gloss',
    name: 'High Gloss',
    sheen: 85,
    roughness: 0.20,
    specular: 0.75,
    grainStrength: 0.01,
    description: 'Ultra-smooth reflective coat creating sharp specular highlights.'
  },
  stucco: {
    id: 'stucco',
    name: 'Venetian Stucco',
    sheen: 35,
    roughness: 0.80,
    specular: 0.35,
    grainStrength: 0.16,
    description: 'Tactile lime plaster with micro-grit texture and depth variation.'
  }
};

// Aliases for safe lookup
FINISH_PRESETS['Satin Sheen'] = FINISH_PRESETS.satin;
FINISH_PRESETS['Eggshell'] = FINISH_PRESETS.satin;
FINISH_PRESETS['Matte'] = FINISH_PRESETS.matte;
FINISH_PRESETS['Ultra Matte'] = FINISH_PRESETS.matte;
FINISH_PRESETS['Velvet Matte'] = FINISH_PRESETS.matte;
FINISH_PRESETS['High Gloss'] = FINISH_PRESETS.gloss;
FINISH_PRESETS['Pearl'] = FINISH_PRESETS.satin;

export function getFinishPreset(key) {
  if (!key) return FINISH_PRESETS.matte;
  if (typeof key === 'object') return key;
  const direct = FINISH_PRESETS[key] || FINISH_PRESETS[key.toLowerCase()];
  if (direct) return direct;
  const lower = key.toLowerCase();
  if (lower.includes('satin') || lower.includes('eggshell') || lower.includes('pearl')) return FINISH_PRESETS.satin;
  if (lower.includes('gloss')) return FINISH_PRESETS.gloss;
  if (lower.includes('stucco') || lower.includes('plaster')) return FINISH_PRESETS.stucco;
  return FINISH_PRESETS.matte;
}

/**
 * Apply Texture & Sheen to pixel color
 * @param {{r: number, g: number, b: number}} rgb - Base painted color
 * @param {string|object} finish - Finish id or object
 * @param {number} x - Pixel X coordinate (for procedural noise)
 * @param {number} y - Pixel Y coordinate
 * @param {number} lum - Original pixel luminance (0-1)
 * @returns {{r: number, g: number, b: number}}
 */
export function applyTextureToPixel(rgb, finish, x, y, lum) {
  const finishConfig = getFinishPreset(finish);
  let { r, g, b } = rgb;

  // 1. Procedural Micro-grain & Bump (for Stucco & Matte)
  if (finishConfig.grainStrength > 0.03) {
    const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    const grain = (noise - Math.floor(noise)) * 2 - 1; // -1 to 1
    const delta = grain * finishConfig.grainStrength * 40;
    r += delta;
    g += delta;
    b += delta;
  }

  // 2. Specular Sheen Highlight (for Gloss & Satin)
  if (finishConfig.specular > 0.15) {
    if (lum > 0.65) {
      const highlightIntensity = Math.pow((lum - 0.65) / 0.35, 2.5) * finishConfig.specular * 60;
      r += highlightIntensity;
      g += highlightIntensity;
      b += highlightIntensity;
    }
  }

  return {
    r: Math.max(0, Math.min(255, Math.round(r))),
    g: Math.max(0, Math.min(255, Math.round(g))),
    b: Math.max(0, Math.min(255, Math.round(b)))
  };
}
