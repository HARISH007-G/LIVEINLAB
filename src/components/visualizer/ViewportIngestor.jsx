import React from 'react';
import { ImagePlus, Sparkles } from 'lucide-react';
import styles from './ViewportIngestor.module.css';

export const ViewportIngestor = ({
  samplePresets = [],
  activePresetId,
  onSelectPreset,
  onUploadClick,
  fileInputRef,
  onManualUpload
}) => {
  return (
    <div className={styles.ingestorCard}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
        onChange={onManualUpload}
      />

      {/* Laser Drop Aperture */}
      <button
        type="button"
        className={styles.uploadPhotoBtn}
        onClick={onUploadClick}
        title="Upload room or facade photo"
      >
        <div className={styles.laserCornerTL} />
        <div className={styles.laserCornerTR} />
        <div className={styles.laserCornerBL} />
        <div className={styles.laserCornerBR} />
        <ImagePlus className={styles.uploadIcon} size={18} />
        <span className={styles.uploadText}>UPLOAD SPACE PHOTO</span>
      </button>

      {/* Space Presets Horizontal Selector */}
      <div className={styles.presetSpaceList}>
        <div className={styles.miniHeaderRow}>
          <div className={styles.labelWithIcon}>
            <Sparkles size={11} className={styles.sparkleIcon} />
            <span className={styles.miniHeader}>ARCHITECTURAL PRESETS</span>
          </div>
          <span className={styles.isoTag}>ISO 100 • 5500K</span>
        </div>
        <div className={styles.presetSpaceGrid}>
          {samplePresets.map((preset) => {
            const label =
              preset.id === 'minimalist-living-room'
                ? 'Living Room'
                : preset.id === 'modern-villa-exterior'
                ? 'Villa Facade'
                : 'Master Bed';
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`${styles.presetSpaceBtn} ${isActive ? styles.presetSpaceActive : ''}`}
                onClick={() => onSelectPreset(preset)}
                title={preset.description || preset.name}
              >
                {isActive && <span className={styles.activeDot} />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewportIngestor;
