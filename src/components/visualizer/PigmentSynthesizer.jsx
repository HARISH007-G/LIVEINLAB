import React from 'react';
import { Palette } from 'lucide-react';
import styles from './PigmentSynthesizer.module.css';

export const PigmentSynthesizer = ({
  colorInputMode = 'hex',
  customHexInput = '#F4EBDD',
  customR = 244,
  customG = 235,
  customB = 221,
  onColorInputModeChange,
  onHexInputChange,
  onRgbChange,
  onOpenNativePicker
}) => {
  return (
    <div className={styles.customCodeCard}>
      {/* Tab Switcher */}
      <div className={styles.codeTabs}>
        <button
          type="button"
          className={`${styles.codeTabBtn} ${colorInputMode === 'hex' ? styles.codeTabActive : ''}`}
          onClick={() => onColorInputModeChange('hex')}
        >
          HEX SYNTHESIS
        </button>
        <button
          type="button"
          className={`${styles.codeTabBtn} ${colorInputMode === 'rgb' ? styles.codeTabActive : ''}`}
          onClick={() => onColorInputModeChange('rgb')}
        >
          RGB CHANNELS
        </button>
      </div>

      {/* HEX Mode */}
      {colorInputMode === 'hex' ? (
        <div className={styles.hexInputWrapper}>
          <span className={styles.inputPrefix}>#</span>
          <input
            type="text"
            maxLength={7}
            value={customHexInput.replace('#', '')}
            onChange={onHexInputChange}
            placeholder="F4EBDD"
            className={styles.hexInputField}
          />
          <button
            type="button"
            className={styles.pickerBtn}
            onClick={onOpenNativePicker}
            title="Open Color Wheel"
          >
            <Palette size={16} />
          </button>
        </div>
      ) : (
        /* RGB Mode */
        <div className={styles.rgbInputGrid}>
          <div className={styles.rgbFieldWrap}>
            <span className={styles.rgbLabel}>R</span>
            <input
              type="number"
              min="0"
              max="255"
              value={customR}
              onChange={(e) => onRgbChange('r', e.target.value)}
              className={styles.rgbInput}
            />
          </div>
          <div className={styles.rgbFieldWrap}>
            <span className={styles.rgbLabel}>G</span>
            <input
              type="number"
              min="0"
              max="255"
              value={customG}
              onChange={(e) => onRgbChange('g', e.target.value)}
              className={styles.rgbInput}
            />
          </div>
          <div className={styles.rgbFieldWrap}>
            <span className={styles.rgbLabel}>B</span>
            <input
              type="number"
              min="0"
              max="255"
              value={customB}
              onChange={(e) => onRgbChange('b', e.target.value)}
              className={styles.rgbInput}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PigmentSynthesizer;
