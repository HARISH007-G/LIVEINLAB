import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sliders, Sparkles } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import styles from './MaskRefinementModal.module.css';

export const MaskRefinementModal = ({
  isOpen,
  surfaceName = 'Active Surface',
  onClose,
  onApply,
  onPreview
}) => {
  const [holeRadius, setHoleRadius] = useState(2);
  const [minIsland, setMinIsland] = useState(80);
  const [snapRadius, setSnapRadius] = useState(3);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      holeClosingRadius: holeRadius,
      minIslandPixels: minIsland,
      snapRadius: snapRadius
    });
    onClose();
  };

  const handleParamChange = (type, val) => {
    let h = holeRadius;
    let m = minIsland;
    let s = snapRadius;
    if (type === 'hole') {
      setHoleRadius(val);
      h = val;
    } else if (type === 'island') {
      setMinIsland(val);
      m = val;
    } else if (type === 'snap') {
      setSnapRadius(val);
      s = val;
    }
    if (onPreview) {
      onPreview({
        holeClosingRadius: h,
        minIslandPixels: m,
        snapRadius: s
      });
    }
  };

  return (
    <AnimatePresence>
      <div className={styles.modalBackdrop} onClick={onClose}>
        <motion.div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <div className={styles.iconBadge}>
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Refine Mask Boundary</h3>
                <p className={styles.modalSubtitle}>Auto-snapping & pinhole closure for {surfaceName}</p>
              </div>
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {/* Controls */}
          <div className={styles.controlsList}>
            {/* 1. Hole Closing Radius */}
            <div className={styles.controlItem}>
              <div className={styles.controlHeader}>
                <span className={styles.controlLabel}>Pinhole Gap Closure</span>
                <span className={styles.controlVal}>{holeRadius}px</span>
              </div>
              <Slider.Root
                className={styles.sliderRoot}
                value={[holeRadius]}
                min={1}
                max={6}
                step={1}
                onValueChange={([val]) => handleParamChange('hole', val)}
              >
                <Slider.Track className={styles.sliderTrack}>
                  <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} aria-label="Hole Closing Radius" />
              </Slider.Root>
              <span className={styles.controlDesc}>Fills small cracks, nail holes, and wall seams automatically.</span>
            </div>

            {/* 2. Small Island Removal */}
            <div className={styles.controlItem}>
              <div className={styles.controlHeader}>
                <span className={styles.controlLabel}>Speckle Island Cleanup</span>
                <span className={styles.controlVal}>{minIsland}px</span>
              </div>
              <Slider.Root
                className={styles.sliderRoot}
                value={[minIsland]}
                min={20}
                max={300}
                step={10}
                onValueChange={([val]) => handleParamChange('island', val)}
              >
                <Slider.Track className={styles.sliderTrack}>
                  <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} aria-label="Small Island Removal" />
              </Slider.Root>
              <span className={styles.controlDesc}>Purges tiny isolated stray paint flecks outside the main wall plane.</span>
            </div>

            {/* 3. Gradient Boundary Snap */}
            <div className={styles.controlItem}>
              <div className={styles.controlHeader}>
                <span className={styles.controlLabel}>Canny Edge Boundary Snapping</span>
                <span className={styles.controlVal}>{snapRadius}px</span>
              </div>
              <Slider.Root
                className={styles.sliderRoot}
                value={[snapRadius]}
                min={1}
                max={6}
                step={1}
                onValueChange={([val]) => handleParamChange('snap', val)}
              >
                <Slider.Track className={styles.sliderTrack}>
                  <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} aria-label="Canny Boundary Snap" />
              </Slider.Root>
              <span className={styles.controlDesc}>Locks the perimeter tightly to wall-floor trim, ceiling, and corners.</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.footerActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.applyBtn} onClick={handleApply}>
              <Check size={14} />
              Apply Refinement
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MaskRefinementModal;
