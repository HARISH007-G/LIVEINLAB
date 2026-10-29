import React from 'react';
import { Zap } from 'lucide-react';
import styles from './GoldenRatioHarmonizer.module.css';

export const GoldenRatioHarmonizer = ({
  harmonizerPalette,
  activeFinish = 'matte',
  onSelectColor,
  onApplyHarmonizerToSurfaces
}) => {
  const dominant = harmonizerPalette?.dominant || { name: 'Dominant Base', hex: '#F4EBDD' };
  const subordinate =
    harmonizerPalette?.subordinate || harmonizerPalette?.secondary || {
      name: 'Subordinate Tone',
      hex: '#64748B'
    };
  const accent = harmonizerPalette?.accent || { name: 'Accent Tone', hex: '#D97706' };

  return (
    <div className={styles.harmonizerCard}>
      {/* Header with Apply Action */}
      <div className={styles.harmonizerHeader}>
        <span className={styles.sectionMiniTag}>60-30-10 SPATIAL BALANCE</span>
        <button
          type="button"
          className={styles.applyAllBtn}
          onClick={onApplyHarmonizerToSurfaces}
          title="Distribute 60-30-10 palette automatically across detected walls"
        >
          <Zap size={11} className={styles.zapIcon} />
          <span>APPLY HARMONY</span>
        </button>
      </div>

      {/* Proportional Golden Ratio Progress Bar */}
      <div className={styles.proportionalBar}>
        <div
          className={styles.propSegmentDom}
          style={{ width: '60%', backgroundColor: dominant.hex }}
          title={`60% Dominant: ${dominant.name}`}
        >
          <span>60%</span>
        </div>
        <div
          className={styles.propSegmentSub}
          style={{ width: '30%', backgroundColor: subordinate.hex }}
          title={`30% Subordinate: ${subordinate.name}`}
        >
          <span>30%</span>
        </div>
        <div
          className={styles.propSegmentAcc}
          style={{ width: '10%', backgroundColor: accent.hex }}
          title={`10% Accent: ${accent.name}`}
        >
          <span>10%</span>
        </div>
      </div>

      {/* 3 Interactive Color Cards */}
      <div className={styles.harmonizerGrid}>
        {/* Dominant 60% */}
        <div
          className={styles.harmonyItem}
          onClick={() =>
            onSelectColor({
              code: 'DOM-60',
              name: dominant.name,
              brand: 'Harmonized 60%',
              hex: dominant.hex,
              finish: activeFinish
            })
          }
        >
          <div className={styles.harmonySwatch} style={{ backgroundColor: dominant.hex }} />
          <span className={styles.harmonyPercent}>60% DOMINANT</span>
          <span className={styles.harmonyName}>{dominant.name}</span>
        </div>

        {/* Subordinate 30% */}
        <div
          className={styles.harmonyItem}
          onClick={() =>
            onSelectColor({
              code: 'SUB-30',
              name: subordinate.name,
              brand: 'Harmonized 30%',
              hex: subordinate.hex,
              finish: activeFinish
            })
          }
        >
          <div className={styles.harmonySwatch} style={{ backgroundColor: subordinate.hex }} />
          <span className={styles.harmonyPercent}>30% SUBORDINATE</span>
          <span className={styles.harmonyName}>{subordinate.name}</span>
        </div>

        {/* Accent 10% */}
        <div
          className={styles.harmonyItem}
          onClick={() =>
            onSelectColor({
              code: 'ACC-10',
              name: accent.name,
              brand: 'Harmonized 10%',
              hex: accent.hex,
              finish: activeFinish
            })
          }
        >
          <div className={styles.harmonySwatch} style={{ backgroundColor: accent.hex }} />
          <span className={styles.harmonyPercent}>10% ACCENT</span>
          <span className={styles.harmonyName}>{accent.name}</span>
        </div>
      </div>
    </div>
  );
};

export default GoldenRatioHarmonizer;
