import React, { useState } from 'react';
import styles from './ColorSpecimenCard.module.css';

// Helper to calculate Light Reflectance Value (LRV) from HEX
const calculateLRV = (hex) => {
  if (!hex || hex[0] !== '#') return 50;
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  // Relative luminance formula
  const lrv = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return Math.round(lrv * 100);
};

// Helper to convert HEX to RGB string
const hexToRgbString = (hex) => {
  if (!hex || hex[0] !== '#') return 'rgb(240, 240, 240)';
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

export const ColorSpecimenCard = ({ color, onTestInStudio }) => {
  const [copied, setCopied] = useState(false);
  const lrv = calculateLRV(color.hex);
  const rgb = hexToRgbString(color.hex);

  const handleCopyHex = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={styles.specimenCard} onClick={() => onTestInStudio(color)}>
      {/* 1. PHYSICAL TACTILE SWATCH SPECIMEN */}
      <div className={styles.swatchBlock} style={{ backgroundColor: color.hex }}>
        {/* Specular Light Reflection & Texture Overlay */}
        <div className={styles.textureSheen}></div>

        {/* Top Badges */}
        <div className={styles.swatchTopRow}>
          <div className={styles.tonePill}>
            <span className={styles.toneDot}></span>
            <span>{color.tone ? color.tone.toUpperCase() : 'NEUTRAL'}</span>
          </div>

          <span className={styles.finishBadge}>
            {color.finish ? color.finish.toUpperCase() : 'MATTE'}
          </span>
        </div>

        {/* Center Hover Action */}
        <div className={styles.hoverActionOverlay}>
          <div className={styles.hoverStudioPill}>
            <span>Test in Studio</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
          </div>
        </div>

        {/* Translucent Code Watermark */}
        <span className={styles.codeWatermark}>{color.code}</span>
      </div>

      {/* 2. ARCHITECTURAL MONOGRAPH DETAILS */}
      <div className={styles.specimenBody}>
        {/* Title & LRV Row */}
        <div className={styles.headerRow}>
          <div className={styles.titleWrap}>
            <h3 className={styles.colorName}>{color.name}</h3>
            <span className={styles.brandSubtitle}>{color.brand} • {color.code}</span>
          </div>
          <div className={styles.lrvBadge} title={`Light Reflectance Value: ${lrv}%`}>
            <span className={styles.lrvLabel}>LRV</span>
            <span className={styles.lrvVal}>{lrv}%</span>
          </div>
        </div>

        {/* Description */}
        {color.description && (
          <p className={styles.descriptionText}>{color.description}</p>
        )}

        {/* Technical Color Codes */}
        <div className={styles.techDataRow}>
          <div className={styles.hexTag} onClick={handleCopyHex} title="Click to copy HEX code">
            <span className={styles.hexHash}>#</span>
            <span className={styles.hexVal}>{color.hex.replace('#', '').toUpperCase()}</span>
            <span className={`material-symbols-outlined ${styles.copyIcon}`}>
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied && <span className={styles.copiedToast}>COPIED</span>}
          </div>

          <div className={styles.rgbTag}>
            <span className={styles.rgbLabel}>RGB</span>
            <span className={styles.rgbVal}>{rgb}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className={styles.studioActionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onTestInStudio(color);
          }}
        >
          <span>TEST ON WALLS</span>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default ColorSpecimenCard;
