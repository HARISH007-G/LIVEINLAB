/**
 * VANNAM Surface State Manager
 * 
 * Provides memory-safe state transitions and undo/redo history for multi-surface editing:
 * - Ensures genuine independent pixel masks per surface (no shared references)
 * - Manages surface attributes (mask, color, finish, strength, lighting, texture, coverage, confidence)
 * - High-speed local mask updates for 60 FPS brush/eraser performance
 */

export function createSurfaceStore(initialSurfaces = []) {
  let surfaces = initialSurfaces.map(s => ({
    ...s,
    mask: s.mask ? new Uint8ClampedArray(s.mask) : null
  }));

  let activeSurfaceId = surfaces[0]?.id || null;
  const undoStack = [];
  const redoStack = [];
  const MAX_HISTORY = 20;

  function cloneSurfaces(list) {
    return list.map(s => ({
      ...s,
      mask: s.mask ? new Uint8ClampedArray(s.mask) : null
    }));
  }

  function pushHistory() {
    undoStack.push(cloneSurfaces(surfaces));
    if (undoStack.length > MAX_HISTORY) {
      undoStack.shift();
    }
    redoStack.length = 0;
  }

  return {
    getSurfaces() {
      return surfaces;
    },

    getActiveSurface() {
      return surfaces.find(s => s.id === activeSurfaceId) || surfaces[0] || null;
    },

    getActiveSurfaceId() {
      return activeSurfaceId;
    },

    setActiveSurfaceId(id) {
      if (surfaces.some(s => s.id === id)) {
        activeSurfaceId = id;
      }
    },

    setSurfaces(newSurfaces) {
      pushHistory();
      surfaces = newSurfaces.map(s => ({
        ...s,
        mask: s.mask ? new Uint8ClampedArray(s.mask) : null
      }));
      if (!surfaces.some(s => s.id === activeSurfaceId)) {
        activeSurfaceId = surfaces[0]?.id || null;
      }
    },

    addSurface({ name, type = 'custom', mask, color = '#F4EBDD', finish = 'matte', confidence = 0.90 }) {
      pushHistory();
      const newId = `surface-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const totalPixels = mask ? mask.length : 1;
      let pixelCount = 0;
      if (mask) {
        for (let i = 0; i < mask.length; i++) {
          if (mask[i] > 0) pixelCount++;
        }
      }

      const newSurface = {
        id: newId,
        name: name || `Surface ${surfaces.length + 1}`,
        type,
        mask: mask ? new Uint8ClampedArray(mask) : null,
        color,
        finish,
        strength: 0.90,
        lightingPreservation: 0.75,
        textureRetention: 0.15,
        coverage: Number(((pixelCount / totalPixels) * 100).toFixed(1)),
        confidence
      };

      surfaces.push(newSurface);
      activeSurfaceId = newId;
      return newSurface;
    },

    removeSurface(id) {
      if (surfaces.length <= 1) return false;
      pushHistory();
      surfaces = surfaces.filter(s => s.id !== id);
      if (activeSurfaceId === id) {
        activeSurfaceId = surfaces[0].id;
      }
      return true;
    },

    updateSurface(id, updates) {
      const idx = surfaces.findIndex(s => s.id === id);
      if (idx === -1) return;

      // Only push history on significant structural changes
      if (updates.mask || updates.color || updates.finish) {
        pushHistory();
      }

      surfaces[idx] = {
        ...surfaces[idx],
        ...updates,
        mask: updates.mask ? new Uint8ClampedArray(updates.mask) : surfaces[idx].mask
      };

      // Recalculate coverage if mask updated
      if (updates.mask) {
        let count = 0;
        const m = surfaces[idx].mask;
        for (let i = 0; i < m.length; i++) {
          if (m[i] > 0) count++;
        }
        surfaces[idx].coverage = Number(((count / m.length) * 100).toFixed(1));
      }
    },

    clearSurfaceMask(id) {
      const surface = surfaces.find(s => s.id === id);
      if (surface && surface.mask) {
        pushHistory();
        surface.mask.fill(0);
        surface.coverage = 0;
      }
    },

    undo() {
      if (undoStack.length === 0) return false;
      redoStack.push(cloneSurfaces(surfaces));
      surfaces = undoStack.pop();
      if (!surfaces.some(s => s.id === activeSurfaceId)) {
        activeSurfaceId = surfaces[0]?.id || null;
      }
      return true;
    },

    redo() {
      if (redoStack.length === 0) return false;
      undoStack.push(cloneSurfaces(surfaces));
      surfaces = redoStack.pop();
      if (!surfaces.some(s => s.id === activeSurfaceId)) {
        activeSurfaceId = surfaces[0]?.id || null;
      }
      return true;
    },

    canUndo() {
      return undoStack.length > 0;
    },

    canRedo() {
      return redoStack.length > 0;
    }
  };
}
