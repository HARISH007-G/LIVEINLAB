/**
 * VANNAM Mask Serializer & Project Persistence Utilities
 * 
 * Provides:
 * 1. Compact Run-Length Encoding (RLE) for high-resolution binary masks (shrinks 2MB JSON down to ~20KB)
 * 2. Lossless decoding back to Uint8ClampedArray
 * 3. Schema validation and error handling for .vannam project files
 */

/**
 * Encodes a Uint8ClampedArray / Uint8Array mask into compact Run-Length pairs.
 * Format: { length: number, runs: [val0, count0, val1, count1, ...] }
 */
export function encodeMaskRLE(mask) {
  if (!mask || mask.length === 0) return null;

  const runs = [];
  let currentVal = mask[0];
  let currentCount = 1;

  for (let i = 1; i < mask.length; i++) {
    if (mask[i] === currentVal) {
      currentCount++;
    } else {
      runs.push(currentVal, currentCount);
      currentVal = mask[i];
      currentCount = 1;
    }
  }
  runs.push(currentVal, currentCount);

  return {
    length: mask.length,
    runs
  };
}

/**
 * Decodes an RLE object or raw array into a Uint8ClampedArray.
 */
export function decodeMaskRLE(data, fallbackLength = 0) {
  if (!data) return null;

  // 1. If already typed array
  if (data instanceof Uint8ClampedArray) return data;
  if (data instanceof Uint8Array) return new Uint8ClampedArray(data);

  // 2. If modern RLE object
  if (data && typeof data === 'object' && Array.isArray(data.runs) && typeof data.length === 'number') {
    const mask = new Uint8ClampedArray(data.length);
    const runs = data.runs;
    let offset = 0;

    for (let i = 0; i < runs.length; i += 2) {
      const val = runs[i];
      const count = runs[i + 1];
      if (val !== 0) {
        mask.fill(val, offset, offset + count);
      }
      offset += count;
    }
    return mask;
  }

  // 3. Backwards compatibility: If legacy raw Array of numbers
  if (Array.isArray(data)) {
    return new Uint8ClampedArray(data);
  }

  return fallbackLength > 0 ? new Uint8ClampedArray(fallbackLength) : null;
}

/**
 * Validates a parsed .vannam project object.
 * Returns { valid: boolean, error?: string, project?: object }
 */
export function validateVannamProject(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'Project file is empty or not a valid JSON object.' };
  }

  if (parsed.app !== 'VANNAM') {
    return { valid: false, error: 'Not a valid VANNAM project file (missing app signature).' };
  }

  if (!Array.isArray(parsed.surfaces)) {
    return { valid: false, error: 'Corrupted project data: surfaces collection is missing.' };
  }

  // Validate surfaces
  for (let i = 0; i < parsed.surfaces.length; i++) {
    const s = parsed.surfaces[i];
    if (!s || typeof s !== 'object') {
      return { valid: false, error: `Surface at index ${i} is invalid.` };
    }
    if (!s.id || !s.name) {
      return { valid: false, error: `Surface at index ${i} is missing required id or name.` };
    }
    if (s.color && typeof s.color !== 'string') {
      return { valid: false, error: `Surface ${s.name} has invalid color format.` };
    }
  }

  return { valid: true, project: parsed };
}
