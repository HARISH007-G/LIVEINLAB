/**
 * VANNAM Smart Brush & Edge-Aware Mask Refinement Engine
 * 
 * Provides:
 * 1. Multi-scale Canny / Sobel gradient field with Non-Maximum Suppression (NMS)
 * 2. Geodesic Gradient-Barrier Smart Brush (stops at architectural boundaries & corners)
 * 3. Edge-Aware Smart Eraser (restores non-wall pixels without damaging adjacent walls)
 * 4. Boundary Snapping & Morphological Mask Refinement (pinhole fill, island removal, edge alignment)
 * 5. Boundary Confidence Estimation
 */

export class SmartBrushEngine {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.gradMagnitude = null;
    this.gradOrientation = null;
    this.cannyEdges = null;
    this.luminance = null;
  }

  /**
   * Initializes or updates gradient fields for a given image.
   */
  init(imageData) {
    const { width, height, data } = imageData;
    const total = width * height;

    this.width = width;
    this.height = height;
    this.luminance = new Float32Array(total);
    this.gradMagnitude = new Float32Array(total);
    this.gradOrientation = new Float32Array(total);
    this.cannyEdges = new Uint8Array(total);

    // 1. Compute Luminance (Y)
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      this.luminance[i] = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255.0;
    }

    // 2. Compute Sobel Gradients
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;

        const tl = this.luminance[(y - 1) * width + (x - 1)];
        const tc = this.luminance[(y - 1) * width + x];
        const tr = this.luminance[(y - 1) * width + (x + 1)];
        const ml = this.luminance[y * width + (x - 1)];
        const mr = this.luminance[y * width + (x + 1)];
        const bl = this.luminance[(y + 1) * width + (x - 1)];
        const bc = this.luminance[(y + 1) * width + x];
        const br = this.luminance[(y + 1) * width + (x + 1)];

        const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
        const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
        const mag = Math.sqrt(gx * gx + gy * gy);

        this.gradMagnitude[idx] = mag;
        this.gradOrientation[idx] = Math.atan2(gy, gx);
      }
    }

    // 3. Non-Maximum Suppression (NMS) to thin edges to crisp ridges
    const nmsMag = new Float32Array(total);
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = y * width + x;
        const mag = this.gradMagnitude[idx];
        if (mag < 0.08) continue;

        // Quantize orientation into 4 directions: 0°, 45°, 90°, 135°
        let angle = (this.gradOrientation[idx] * 180) / Math.PI;
        if (angle < 0) angle += 180;

        let q = 0;
        let r = 0;

        if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle <= 180)) {
          // Horizontal gradient direction -> check East and West neighbors
          q = this.gradMagnitude[idx + 1];
          r = this.gradMagnitude[idx - 1];
        } else if (angle >= 22.5 && angle < 67.5) {
          // Diagonal 45° -> check NE and SW
          q = this.gradMagnitude[(y - 1) * width + (x + 1)];
          r = this.gradMagnitude[(y + 1) * width + (x - 1)];
        } else if (angle >= 67.5 && angle < 112.5) {
          // Vertical 90° -> check North and South
          q = this.gradMagnitude[(y - 1) * width + x];
          r = this.gradMagnitude[(y + 1) * width + x];
        } else if (angle >= 112.5 && angle < 157.5) {
          // Diagonal 135° -> check NW and SE
          q = this.gradMagnitude[(y - 1) * width + (x - 1)];
          r = this.gradMagnitude[(y + 1) * width + (x + 1)];
        }

        if (mag >= q && mag >= r) {
          nmsMag[idx] = mag;
        }
      }
    }

    // 4. Double-Threshold Hysteresis Edge Linking
    const highThreshold = 0.22;
    const lowThreshold = 0.09;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (nmsMag[idx] >= highThreshold) {
          this.cannyEdges[idx] = 1;
        } else if (nmsMag[idx] >= lowThreshold) {
          // Check if connected to a strong edge neighbor (8-way)
          if (
            nmsMag[idx - 1] >= highThreshold ||
            nmsMag[idx + 1] >= highThreshold ||
            nmsMag[idx - width] >= highThreshold ||
            nmsMag[idx + width] >= highThreshold ||
            nmsMag[idx - width - 1] >= highThreshold ||
            nmsMag[idx - width + 1] >= highThreshold ||
            nmsMag[idx + width - 1] >= highThreshold ||
            nmsMag[idx + width + 1] >= highThreshold
          ) {
            this.cannyEdges[idx] = 1;
          }
        }
      }
    }
  }

  /**
   * Geodesic Gradient-Barrier Smart Brush.
   * Paints or erases within brush radius while respecting physical wall edges.
   */
  paintSmartBrush(mask, x0, y0, x1, y1, {
    radius = 28,
    hardness = 0.75,
    mode = 'paint', // 'paint' | 'erase'
    edgeSnap = 'MEDIUM', // 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH'
    protectedMask = null
  } = {}) {
    if (!mask || !this.gradMagnitude) return;

    const width = this.width;
    const height = this.height;
    const total = width * height;

    const dist = Math.hypot(x1 - x0, y1 - y0);
    const step = Math.max(1, radius * 0.20);
    const steps = Math.max(1, Math.ceil(dist / step));

    // Edge barriers thresholds: HIGH = sensitive to subtle edges, LOW = only stops at heavy creases
    const edgeSensitivity = edgeSnap === 'HIGH' ? 0.16 : edgeSnap === 'MEDIUM' ? 0.24 : edgeSnap === 'LOW' ? 0.36 : 0.65;
    const useEdgeBarrier = edgeSnap !== 'OFF';

    const rSq = radius * radius;
    const innerRadiusSq = Math.pow(radius * Math.max(0.1, Math.min(1.0, hardness)), 2);

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = Math.round(x0 + (x1 - x0) * t);
      const cy = Math.round(y0 + (y1 - y0) * t);

      const minX = Math.max(0, cx - radius);
      const maxX = Math.min(width - 1, cx + radius);
      const minY = Math.max(0, cy - radius);
      const maxY = Math.min(height - 1, cy + radius);

      // Local region queue for gradient barrier flooding from center
      const centerIdx = cy * width + cx;
      if (centerIdx < 0 || centerIdx >= total) continue;

      // When edge snapping is active, run a local barrier expansion
      if (useEdgeBarrier) {
        this.expandConstrainedBrush({
          mask,
          cx,
          cy,
          radius,
          hardness,
          mode,
          edgeSensitivity,
          protectedMask
        });
      } else {
        // Standard smooth radial brush
        const targetVal = mode === 'erase' ? 0 : 255;
        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            const idx = y * width + x;
            if (protectedMask && protectedMask[idx] === 1) continue;

            const dSq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
            if (dSq <= rSq) {
              if (dSq <= innerRadiusSq) {
                mask[idx] = targetVal;
              } else {
                const alphaFactor = 1 - (Math.sqrt(dSq) - radius * hardness) / (radius * (1 - hardness) + 0.001);
                const factor = Math.max(0, Math.min(1, alphaFactor));
                if (mode === 'erase') {
                  mask[idx] = Math.round(mask[idx] * (1 - factor));
                } else {
                  mask[idx] = Math.max(mask[idx], Math.round(255 * factor));
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Local BFS within brush circle, blocked by strong edges and creases.
   */
  expandConstrainedBrush({
    mask,
    cx,
    cy,
    radius,
    hardness,
    mode,
    edgeSensitivity,
    protectedMask
  }) {
    const width = this.width;
    const height = this.height;
    const total = width * height;
    const rSq = radius * radius;
    const innerRadius = radius * hardness;

    const visited = new Uint8Array(total);
    const queue = new Int32Array(Math.PI * rSq * 2 + 64);
    let qHead = 0;
    let qTail = 0;

    const centerIdx = cy * width + cx;
    if (centerIdx < 0 || centerIdx >= total) return;
    if (protectedMask && protectedMask[centerIdx] === 1) return;

    queue[qTail++] = centerIdx;
    visited[centerIdx] = 1;

    const targetVal = mode === 'erase' ? 0 : 255;

    while (qHead < qTail) {
      const idx = queue[qHead++];
      const x = idx % width;
      const y = Math.floor(idx / width);

      const dSq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      const d = Math.sqrt(dSq);

      // Compute feather factor
      let factor = 1.0;
      if (d > innerRadius) {
        factor = Math.max(0, 1 - (d - innerRadius) / (radius - innerRadius + 0.001));
      }

      if (mode === 'erase') {
        mask[idx] = Math.round(mask[idx] * (1 - factor));
      } else {
        mask[idx] = Math.max(mask[idx], Math.round(255 * factor));
      }

      // Check 4-connected neighbors
      const neighbors = [];
      if (x > 0) neighbors.push(idx - 1);
      if (x < width - 1) neighbors.push(idx + 1);
      if (y > 0) neighbors.push(idx - width);
      if (y < height - 1) neighbors.push(idx + width);

      for (const nIdx of neighbors) {
        if (visited[nIdx] === 1) continue;
        visited[nIdx] = 1;

        if (protectedMask && protectedMask[nIdx] === 1) continue;

        const nx = nIdx % width;
        const ny = Math.floor(nIdx / width);
        const ndSq = (nx - cx) * (nx - cx) + (ny - cy) * (ny - cy);
        if (ndSq > rSq) continue;

        // Stop at Canny edges or high gradient magnitude
        if (this.cannyEdges[nIdx] === 1 || this.gradMagnitude[nIdx] > edgeSensitivity) {
          continue; // Gradient barrier reached
        }

        queue[qTail++] = nIdx;
      }
    }
  }

  /**
   * Refines a rough or noisy surface mask:
   * 1. Morphological Closing (fills pinholes and narrow cracks)
   * 2. Small Island Removal (removes isolated pixel clusters)
   * 3. Gradient Boundary Snapping (snaps soft edges to nearest Canny ridge)
   * 4. Safe Protected Mask Enforcement (windows, doors, floor)
   */
  refineMask(sourceMask, {
    holeClosingRadius = 2,
    minIslandPixels = 120,
    snapRadius = 3,
    protectedMask = null
  } = {}) {
    if (!sourceMask || !this.gradMagnitude) return sourceMask;

    const width = this.width;
    const height = this.height;
    const total = width * height;
    const refined = new Uint8ClampedArray(sourceMask);

    // 1. Morphological Closing (Dilation followed by Erosion on local window)
    const dilated = new Uint8ClampedArray(total);
    const r = Math.max(1, holeClosingRadius);

    for (let y = r; y < height - r; y++) {
      for (let x = r; x < width - r; x++) {
        const idx = y * width + x;
        if (sourceMask[idx] > 32) {
          dilated[idx] = 255;
          continue;
        }
        // Check if surrounded by mask
        let maskCount = 0;
        let totalCount = 0;
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            totalCount++;
            if (sourceMask[(y + dy) * width + (x + dx)] > 32) {
              maskCount++;
            }
          }
        }
        if (maskCount >= totalCount * 0.60) {
          dilated[idx] = 255;
        }
      }
    }

    // 2. Erosion back to preserve original scale while keeping closed holes
    for (let y = r; y < height - r; y++) {
      for (let x = r; x < width - r; x++) {
        const idx = y * width + x;
        if (dilated[idx] === 0) {
          refined[idx] = 0;
          continue;
        }

        let holeCount = 0;
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (dilated[(y + dy) * width + (x + dx)] === 0) {
              holeCount++;
            }
          }
        }
        refined[idx] = holeCount > (2 * r + 1) * 1.5 ? 0 : 255;
      }
    }

    // 3. Gradient Boundary Snapping: For perimeter pixels, snap to Canny ridge if within snapRadius
    const snapR = Math.max(1, snapRadius);
    for (let y = snapR; y < height - snapR; y++) {
      for (let x = snapR; x < width - snapR; x++) {
        const idx = y * width + x;
        const val = refined[idx];

        // Only inspect boundary pixels (where neighbors differ)
        const isBoundary =
          (val > 0 && (refined[idx - 1] === 0 || refined[idx + 1] === 0 || refined[idx - width] === 0 || refined[idx + width] === 0)) ||
          (val === 0 && (refined[idx - 1] > 0 || refined[idx + 1] > 0 || refined[idx - width] > 0 || refined[idx + width] > 0));

        if (!isBoundary) continue;

        // Search within snapR for a strong Canny edge
        let bestEdgeDist = 999;
        let bestEdgeIdx = -1;

        for (let dy = -snapR; dy <= snapR; dy++) {
          for (let dx = -snapR; dx <= snapR; dx++) {
            const nIdx = (y + dy) * width + (x + dx);
            if (this.cannyEdges[nIdx] === 1) {
              const d = Math.hypot(dx, dy);
              if (d < bestEdgeDist) {
                bestEdgeDist = d;
                bestEdgeIdx = nIdx;
              }
            }
          }
        }

        if (bestEdgeIdx !== -1 && bestEdgeDist <= snapR) {
          // If we found an edge, snap mask boundary to align with the edge
          const nx = bestEdgeIdx % width;
          const ny = Math.floor(bestEdgeIdx / width);
          // If the pixel is inside the edge boundary relative to wall interior, snap it
          if (val === 0 && bestEdgeDist <= 1.5) {
            refined[idx] = 255;
          }
        }
      }
    }

    // 4. Small Island Removal (Connected Components on mask)
    const visited = new Uint8Array(total);
    const queue = new Int32Array(total);

    for (let i = 0; i < total; i++) {
      if (refined[i] === 0 || visited[i] === 1) continue;

      let qHead = 0;
      let qTail = 0;
      queue[qTail++] = i;
      visited[i] = 1;

      const compIndices = [];

      while (qHead < qTail) {
        const cIdx = queue[qHead++];
        compIndices.push(cIdx);

        const cx = cIdx % width;
        const cy = Math.floor(cIdx / width);

        const neighbors = [];
        if (cx > 0) neighbors.push(cIdx - 1);
        if (cx < width - 1) neighbors.push(cIdx + 1);
        if (cy > 0) neighbors.push(cIdx - width);
        if (cy < height - 1) neighbors.push(cIdx + width);

        for (const nIdx of neighbors) {
          if (refined[nIdx] > 0 && visited[nIdx] === 0) {
            visited[nIdx] = 1;
            queue[qTail++] = nIdx;
          }
        }
      }

      if (compIndices.length < minIslandPixels) {
        // Discard isolated tiny speckle
        for (const cIdx of compIndices) {
          refined[cIdx] = 0;
        }
      }
    }

    // 5. Protected Mask Enforcement
    if (protectedMask) {
      for (let i = 0; i < total; i++) {
        if (protectedMask[i] === 1) {
          refined[i] = 0;
        }
      }
    }

    return refined;
  }

  /**
   * Computes boundary confidence (0.0 to 1.0) based on how well the mask perimeter aligns with image edges.
   */
  computeBoundaryConfidence(mask) {
    if (!mask || !this.gradMagnitude) return 0.85;
    const width = this.width;
    const height = this.height;

    let boundaryPixels = 0;
    let edgeAlignedPixels = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (mask[idx] === 0) continue;

        // Is boundary pixel?
        if (
          mask[idx - 1] === 0 ||
          mask[idx + 1] === 0 ||
          mask[idx - width] === 0 ||
          mask[idx + width] === 0
        ) {
          boundaryPixels++;
          if (this.cannyEdges[idx] === 1 || this.gradMagnitude[idx] > 0.18) {
            edgeAlignedPixels++;
          }
        }
      }
    }

    if (boundaryPixels === 0) return 0.50;
    const alignmentRatio = edgeAlignedPixels / boundaryPixels;
    return Math.max(0.60, Math.min(0.98, Number((0.60 + alignmentRatio * 0.38).toFixed(2))));
  }
}
