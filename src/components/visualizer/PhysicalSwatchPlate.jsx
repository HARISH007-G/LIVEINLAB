import React from 'react';
import { Pipette, Copy, Check } from 'lucide-react';
import styles from './PhysicalSwatchPlate.module.css';

export const PhysicalSwatchPlate = ({
  selectedColor,
  activeLrv = 50,
  copiedHex = false,
  onCopyHex,
  onOpenColorPicker,
  nativeColorPickerRef,
  onNativePickerChange
}) => {
  return (
    <div className={styles.selectedHeroCard}>
      <input
        ref={nativeColorPickerRef}
        type="color"
        value={selectedColor.hex}
        onChange={onNativePickerChange}
        style={{ display: 'none' }}
      />

      {/* Tactile Swatch Circle Plate */}
      <div
        className={styles.selectedSwatchCircle}
        style={{ backgroundColor: selectedColor.hex }}
        onClick={onOpenColorPicker}
        title="Click to open full color spectrum"
      >
        <div className={styles.plateGlossSheen} />
        <Pipette className={styles.pipIcon} size={15} />
      </div>

      {/* Swatch Metadata */}
      <div className={styles.selectedMeta}>
        <div className={styles.topMetaRow}>
          <span className={styles.selectedBrand}>
            {(selectedColor.brand || 'VANNAM').toUpperCase()}
          </span>
          <span className={styles.codeTag}>{selectedColor.code}</span>
        </div>

        <h3 className={styles.selectedName}>{selectedColor.name}</h3>

        <div className={styles.colorValRow}>
          <button
            type="button"
            className={styles.selectedHexBtn}
            onClick={onCopyHex}
            title="Click to copy HEX code"
          >
            <span className={styles.hexText}>{selectedColor.hex}</span>
            {copiedHex ? (
              <Check size={12} className={styles.checkIcon} />
            ) : (
              <Copy size={12} className={styles.copyIcon} />
            )}
            {copiedHex && <span className={styles.copiedToast}>COPIED!</span>}
          </button>

          <span className={styles.lrvPill} title="Light Reflectance Value">
            LRV: <strong>{activeLrv}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhysicalSwatchPlate;
