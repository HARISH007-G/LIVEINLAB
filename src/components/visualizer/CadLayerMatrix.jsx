import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, Sparkles, Wand2 } from 'lucide-react';
import styles from './CadLayerMatrix.module.css';

export const CadLayerMatrix = ({
  surfaces = [],
  activeSurfaceId,
  hiddenSurfaces = new Set(),
  lockedSurfaces = new Set(),
  isAddingSurface = false,
  onSelectSurface,
  onAutoDetect,
  onToggleVisibility,
  onToggleLock,
  onDeleteSurface,
  onStartAddSurface,
  isProcessing = false
}) => {
  return (
    <div className={styles.surfaceSection}>
      {/* Header Row */}
      <div className={styles.surfaceHeaderRow}>
        <div className={styles.tagWrap}>
          <span className={styles.sectionMiniTag}>CAD PLANAR STACK</span>
          <span className={styles.countBadge}>{surfaces.length}</span>
        </div>
        <button
          type="button"
          className={styles.autoSplitBtn}
          onClick={onAutoDetect}
          disabled={isProcessing}
          title="Auto-detect all independent wall planes & protected boundaries"
        >
          <Sparkles size={11} className={styles.autoIcon} />
          <span>AUTO DETECT</span>
        </button>
      </div>

      {/* Surface Layer Items */}
      <div className={styles.surfaceList}>
        {surfaces.map((surface, idx) => {
          const isActive = activeSurfaceId === surface.id;
          const isHidden = hiddenSurfaces.has(surface.id);
          const isLocked = lockedSurfaces.has(surface.id);
          const confidencePct = Math.round((surface.confidence || 0.92) * 100);
          const coveragePct = surface.coverage || 35;

          return (
            <div
              key={surface.id}
              className={`${styles.surfaceItemBtn} ${isActive ? styles.surfaceItemActive : ''} ${
                isHidden ? styles.surfaceItemHidden : ''
              }`}
              onClick={() => onSelectSurface(surface)}
            >
              {/* Active Accent Gauge Bar */}
              {isActive && <div className={styles.activeGaugeBar} />}

              {/* Number Index */}
              <span className={styles.surfaceIdx}>
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Swatch Specimen Chip */}
              <div className={styles.surfaceChipWrap}>
                <span
                  className={styles.surfaceDot}
                  style={{ backgroundColor: surface.color || '#2563eb' }}
                />
                <span className={styles.chipSheenGleam} />
              </div>

              {/* Metadata Column */}
              <div className={styles.surfaceMetaCol}>
                <div className={styles.surfaceTitleRow}>
                  <span className={styles.surfaceName}>{surface.name}</span>
                  <span
                    className={`${styles.confidenceBadge} ${
                      confidencePct < 70 ? styles.confReview : confidencePct >= 90 ? styles.confHigh : ''
                    }`}
                    title={`LiDAR Detection Confidence: ${confidencePct}%`}
                  >
                    {confidencePct}%
                  </span>
                </div>

                {/* Coverage Meter Progress Bar */}
                <div className={styles.coverageMeterRow}>
                  <div className={styles.coverageBarTrack}>
                    <div
                      className={styles.coverageBarFill}
                      style={{
                        width: `${Math.max(12, coveragePct)}%`,
                        backgroundColor: surface.color || 'var(--primary)'
                      }}
                    />
                  </div>
                  <span className={styles.surfaceSubTag}>
                    {coveragePct}% • {surface.finish || 'Matte'}
                  </span>
                </div>
              </div>

              {/* Quick Layer Controls: Eye, Lock, Delete */}
              <div className={styles.layerActionsCol}>
                <button
                  type="button"
                  className={`${styles.layerMiniBtn} ${isHidden ? styles.layerMiniBtnOff : ''}`}
                  onClick={(e) => onToggleVisibility(surface.id, e)}
                  title={isHidden ? 'Show Surface Plane' : 'Hide Surface Plane'}
                >
                  {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>

                <button
                  type="button"
                  className={`${styles.layerMiniBtn} ${isLocked ? styles.layerMiniBtnLocked : ''}`}
                  onClick={(e) => onToggleLock(surface.id, e)}
                  title={isLocked ? 'Unlock Surface Layer' : 'Lock Surface Layer'}
                >
                  {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
                </button>

                {surfaces.length > 1 && (
                  <button
                    type="button"
                    className={styles.deleteSurfaceBtn}
                    onClick={(e) => onDeleteSurface(surface.id, e)}
                    title="Remove Surface Layer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* + Add Surface Laser Action Button */}
      <button
        type="button"
        className={`${styles.addSurfaceActionBtn} ${
          isAddingSurface ? styles.addSurfaceBtnActive : ''
        }`}
        onClick={onStartAddSurface}
      >
        {isAddingSurface ? (
          <>
            <Wand2 size={14} className={styles.pulsingIcon} />
            <span>CLICK WALL TO ISOLATE</span>
          </>
        ) : (
          <>
            <Plus size={14} />
            <span>+ ADD SURFACE PLANE</span>
          </>
        )}
      </button>

      {isAddingSurface && (
        <div className={styles.surfacePromptBanner}>
          <span className={styles.targetReticle} />
          <span>Click any wall in viewport to isolate plane</span>
        </div>
      )}
    </div>
  );
};

export default CadLayerMatrix;
