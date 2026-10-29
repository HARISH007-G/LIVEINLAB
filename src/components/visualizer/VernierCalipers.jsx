import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import styles from './VernierCalipers.module.css';

export const VernierCalipers = ({
  brushSize = 28,
  brushSoftness = 40,
  edgeSnapSetting = 'MEDIUM',
  onBrushSizeChange,
  onBrushSoftnessChange,
  onEdgeSnapChange
}) => {
  const snapOptions = [
    { label: 'OFF', val: 'OFF' },
    { label: '4px', val: 'LOW' },
    { label: '8px', val: 'MEDIUM' },
    { label: '16px', val: 'HIGH' }
  ];

  return (
    <div className={styles.caliperContainer}>
      {/* 1. LiDAR Magnetic Edge Snap */}
      <div className={styles.snapGroup}>
        <div className={styles.sliderHeader}>
          <span className={styles.sectionMiniTag}>LIDAR EDGE SNAP</span>
          <span className={styles.cyanVal}>{edgeSnapSetting}</span>
        </div>
        <div className={styles.edgeSnapTabs}>
          {snapOptions.map((opt) => {
            const isActive = edgeSnapSetting === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                className={`${styles.snapTabBtn} ${isActive ? styles.snapTabActive : ''}`}
                onClick={() => onEdgeSnapChange(opt.val)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Vernier Caliper - Brush Diameter */}
      <div className={styles.sliderBlock}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>BRUSH CALIPER</span>
          <span className={styles.cyanVal}>{brushSize}px</span>
        </div>
        <div className={styles.sliderTrackWrapper}>
          <Slider.Root
            className={styles.sliderRoot}
            value={[brushSize]}
            min={4}
            max={120}
            step={1}
            onValueChange={([val]) => onBrushSizeChange(val)}
          >
            <Slider.Track className={styles.sliderTrack}>
              <Slider.Range className={styles.sliderRange} />
            </Slider.Track>
            <Slider.Thumb className={styles.sliderThumb} aria-label="Brush Caliper Size" />
          </Slider.Root>
          <div className={styles.caliperTicks}>
            <span /><span /><span /><span /><span />
          </div>
        </div>
      </div>

      {/* 3. Vernier Caliper - Edge Feathering */}
      <div className={styles.sliderBlock}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>EDGE FEATHERING</span>
          <span className={styles.cyanVal}>{brushSoftness}%</span>
        </div>
        <div className={styles.sliderTrackWrapper}>
          <Slider.Root
            className={styles.sliderRoot}
            value={[brushSoftness]}
            min={0}
            max={100}
            step={1}
            onValueChange={([val]) => onBrushSoftnessChange(val)}
          >
            <Slider.Track className={styles.sliderTrack}>
              <Slider.Range className={styles.sliderRange} />
            </Slider.Track>
            <Slider.Thumb className={styles.sliderThumb} aria-label="Edge Feathering Softness" />
          </Slider.Root>
          <div className={styles.caliperTicks}>
            <span /><span /><span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VernierCalipers;
