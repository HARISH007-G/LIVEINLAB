import React, { useState } from 'react';
import styles from './BentoGrid.module.css';

export const BentoGrid = () => {
  const [activeHarmonizerColor, setActiveHarmonizerColor] = useState('#2563EB');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section className={styles.bentoSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>
            <span className={styles.dot}></span>
            <span>CORE ARCHITECTURAL HARDWARE & AI</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Engineered for high-rise facades.<br />
            <span>Built for sub-millimeter perfection.</span>
          </h2>
          <p className={styles.sectionLead}>
            Four integrated systems operating concurrently: autonomous adhesion, LiDAR trajectory planning, automated spray deposition, and multi-surface color science.
          </p>
        </div>

        {/* 4-Tile Asymmetric Bento Grid */}
        <div className={styles.bentoGrid}>
          {/* Tile 1: LiDAR Scanning Radar (Large Top Left) */}
          <div className={`${styles.bentoCard} ${styles.tileLidar}`} onMouseMove={handleMouseMove}>
            <div className={styles.radarVisualWrap}>
              <div className={styles.radarCircle1}></div>
              <div className={styles.radarCircle2}></div>
              <div className={styles.radarSweep}></div>
              <div className={styles.radarTarget1}></div>
              <div className={styles.radarTarget2}></div>
              <div className={styles.lidarCoordinates}>
                <span>X: 04.82m</span>
                <span>Y: 18.40m</span>
                <span>Z: 0.25m</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardTag}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>radar</span>
                <span>DUAL-AXIS LIDAR MAPPING</span>
              </div>
              <h3 className={styles.cardTitle}>Autonomous Spatial Wall Profiling</h3>
              <p className={styles.cardDesc}>
                Real-time point-cloud scanning identifies windows, structural seams, and surface undulations to plan optimal raster trajectories.
              </p>
            </div>
          </div>

          {/* Tile 2: Precision Micron Deposition (Top Right) */}
          <div className={`${styles.bentoCard} ${styles.tileDeposition}`}>
            <div className={styles.gaugeVisualWrap}>
              <div className={styles.gaugeNumber}>
                <span className={styles.gaugeBig}>250</span>
                <span className={styles.gaugeUnit}>μm</span>
              </div>
              <div className={styles.gaugeBarTrack}>
                <div className={styles.gaugeBarFill} style={{ width: '92%' }}></div>
              </div>
              <div className={styles.gaugeMetaRow}>
                <span>PRESSURE: 180 BAR</span>
                <span className={styles.gaugeGreen}>ACCURACY: ±3 μm</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardTag}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>speed</span>
                <span>AIRLESS FLUIDICS</span>
              </div>
              <h3 className={styles.cardTitle}>Sub-Millimeter Coating Thickness</h3>
              <p className={styles.cardDesc}>
                Closed-loop pressure regulation guarantees uniform paint deposition across thousands of square meters without human fatigue.
              </p>
            </div>
          </div>

          {/* Tile 3: Zero Fall Risk Safety (Bottom Left) */}
          <div className={`${styles.bentoCard} ${styles.tileSafety}`}>
            <div className={styles.safetyVisualWrap}>
              <div className={styles.safetyIconRing}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>shield</span>
              </div>
              <div className={styles.safetyMetric}>
                <span className={styles.zeroNumber}>0</span>
                <span className={styles.safetySub}>HUMAN FALL HAZARDS</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardTag}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                <span>OSHA COMPLIANCE</span>
              </div>
              <h3 className={styles.cardTitle}>Ground-Station Telemetry Control</h3>
              <p className={styles.cardDesc}>
                Operators control vertical operations safely from the ground via encrypted real-time radio telemetry.
              </p>
            </div>
          </div>

          {/* Tile 4: Multi-Surface Color Harmonizer (Bottom Right) */}
          <div className={`${styles.bentoCard} ${styles.tileHarmonizer}`}>
            <div className={styles.harmonizerInteractive}>
              <div className={styles.colorPalettePreview}>
                <div
                  className={styles.swatchLarge}
                  style={{ backgroundColor: activeHarmonizerColor }}
                >
                  <span className={styles.swatchRatio}>60% DOMINANT</span>
                </div>
                <div className={styles.swatchSplit}>
                  <div className={styles.swatchSmall1}>
                    <span className={styles.swatchRatio}>30%</span>
                  </div>
                  <div className={styles.swatchSmall2}>
                    <span className={styles.swatchRatio}>10%</span>
                  </div>
                </div>
              </div>

              <div className={styles.paletteSwitcher}>
                {['#2563EB', '#0D9488', '#D97706', '#1E293B'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`${styles.paletteDot} ${activeHarmonizerColor === color ? styles.paletteDotActive : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setActiveHarmonizerColor(color)}
                    aria-label={`Select ${color} scheme`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardTag}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>palette</span>
                <span>60-30-10 COLOR SCIENCE</span>
              </div>
              <h3 className={styles.cardTitle}>Multi-Surface Plane Segmentation</h3>
              <p className={styles.cardDesc}>
                Separates Main Walls, Accent Walls, and Trim into independent architectural masks with time-of-day lighting simulation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
