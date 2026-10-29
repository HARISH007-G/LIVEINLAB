import React from 'react';
import styles from './ComparisonSplitShutter.module.css';

export const ComparisonSplitShutter = ({
  splitPos = 0.5,
  onPointerDown,
  onPointerMove,
  onPointerUp
}) => {
  const originalPct = Math.round(splitPos * 100);
  const vannamPct = 100 - originalPct;

  return (
    <>
      {/* Vertical Hairline Split */}
      <div
        className={styles.splitVerticalLine}
        style={{ left: `${splitPos * 100}%` }}
      />

      {/* Knurled Optical Split Handle */}
      <div
        className={styles.splitDragHandle}
        style={{ left: `${splitPos * 100}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        title="Drag horizontally to compare Before / After"
      >
        {/* Floating Dynamic Ratio Pill */}
        <div className={styles.floatingSplitBadge}>
          <span className={styles.origText}>{originalPct}% ORIGINAL</span>
          <span className={styles.splitDividerPipe}>│</span>
          <span className={styles.vannamText}>{vannamPct}% VANNAM</span>
        </div>

        {/* Tactile Knurled Metal Grip */}
        <div className={styles.knurledGrip}>
          <span /><span /><span />
        </div>
      </div>
    </>
  );
};

export default ComparisonSplitShutter;
