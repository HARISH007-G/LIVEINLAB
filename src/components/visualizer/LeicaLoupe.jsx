import React from 'react';
import styles from './LeicaLoupe.module.css';

export const LeicaLoupe = ({
  loupeCanvasRef,
  loupeState = { x: -100, y: -100, visible: false }
}) => {
  if (!loupeState.visible) return null;

  return (
    <div
      className={styles.loupeLens}
      style={{
        left: `${loupeState.x}px`,
        top: `${loupeState.y}px`
      }}
    >
      <canvas
        ref={loupeCanvasRef}
        width={140}
        height={140}
        className={styles.loupeCanvas}
      />
      <div className={styles.loupeReticle}>
        <div className={styles.loupeCrosshair} />
        <div className={styles.reticleTicks}>
          <span /><span /><span /><span />
        </div>
        <span className={styles.loupeZoomTag}>2.5x SAPPHIRE LENS</span>
      </div>
    </div>
  );
};

export default LeicaLoupe;
