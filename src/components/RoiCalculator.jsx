import React, { useState, useMemo } from 'react';
import AnimatedCounter from './AnimatedCounter';
import styles from './RoiCalculator.module.css';

export const RoiCalculator = () => {
  const [floors, setFloors] = useState(18);
  const [surfaceArea, setSurfaceArea] = useState(4500); // in sq meters

  // Calculations
  const stats = useMemo(() => {
    // Traditional manual scaffolding takes ~1 day per 80 sq.m + 1 day per 2 floors of setup
    const manualDays = Math.round((surfaceArea / 80) + (floors * 0.5));
    // VANNAM Rover executes ~800 sq.m per day with 0 scaffolding setup
    const roverDays = Math.max(1, Math.round(surfaceArea / 750));
    const daysSaved = Math.max(1, manualDays - roverDays);

    // Scaffolding rental & labor cost approx $35/sq.m for manual
    const manualCost = Math.round(surfaceArea * 32 + (floors * 450));
    // VANNAM automated deployment approx $14/sq.m
    const roverCost = Math.round(surfaceArea * 13.5);
    const costSaved = Math.max(1000, manualCost - roverCost);
    const percentSaved = Math.round((costSaved / manualCost) * 100);

    const paintSavedLiters = Math.round(surfaceArea * 0.035); // 15% less overspray

    return {
      manualDays,
      roverDays,
      daysSaved,
      manualCost,
      roverCost,
      costSaved,
      percentSaved,
      paintSavedLiters
    };
  }, [floors, surfaceArea]);

  return (
    <section className={styles.calculatorCard}>
      <div className={styles.cardHeader}>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          <span>ENTERPRISE ESTIMATOR</span>
        </div>
        <h3 className={styles.title}>Autonomous Deployment ROI Calculator</h3>
        <p className={styles.subtitle}>
          Compare automated VANNAM vertical execution against traditional multi-tier scaffolding costs and timelines.
        </p>
      </div>

      <div className={styles.calcBodyGrid}>
        {/* Left Interactive Sliders */}
        <div className={styles.slidersColumn}>
          {/* Slider 1: Building Height */}
          <div className={styles.sliderBlock}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>BUILDING HEIGHT</span>
              <span className={styles.sliderValue}>{floors} Floors ({floors * 3.2}m)</span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              value={floors}
              onChange={(e) => setFloors(parseInt(e.target.value, 10))}
              className={styles.rangeInput}
            />
            <div className={styles.scaleRange}>
              <span>Low-Rise (2F)</span>
              <span>Mid-Rise (25F)</span>
              <span>High-Rise (60F)</span>
            </div>
          </div>

          {/* Slider 2: Facade Area */}
          <div className={styles.sliderBlock}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>WALL SURFACE AREA</span>
              <span className={styles.sliderValue}>{surfaceArea.toLocaleString()} m² (~{(surfaceArea * 10.76).toLocaleString()} sq.ft)</span>
            </div>
            <input
              type="range"
              min="500"
              max="25000"
              step="250"
              value={surfaceArea}
              onChange={(e) => setSurfaceArea(parseInt(e.target.value, 10))}
              className={styles.rangeInput}
            />
            <div className={styles.scaleRange}>
              <span>500 m²</span>
              <span>12,500 m²</span>
              <span>25,000 m²</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className={styles.presetRow}>
            <span className={styles.presetLabel}>Quick Presets:</span>
            <button
              type="button"
              className={styles.presetBtn}
              onClick={() => { setFloors(8); setSurfaceArea(1800); }}
            >
              Commercial Plaza
            </button>
            <button
              type="button"
              className={styles.presetBtn}
              onClick={() => { setFloors(24); setSurfaceArea(6500); }}
            >
              Residential Tower
            </button>
            <button
              type="button"
              className={styles.presetBtn}
              onClick={() => { setFloors(45); setSurfaceArea(18000); }}
            >
              High-Rise Complex
            </button>
          </div>
        </div>

        {/* Right Output Results Card */}
        <div className={styles.resultsCard}>
          <div className={styles.savingsHero}>
            <span className={styles.savingsTag}>ESTIMATED COST SAVINGS</span>
            <div className={styles.savingsBig}>
              $<AnimatedCounter value={stats.costSaved} />
              <span className={styles.percentPill}>-{stats.percentSaved}%</span>
            </div>
          </div>

          <div className={styles.metricsCompareGrid}>
            <div className={styles.metricTile}>
              <span className={styles.mLabel}>EXECUTION TIME</span>
              <div className={styles.mValHighlight}>
                <AnimatedCounter value={stats.roverDays} /> Days
              </div>
              <span className={styles.mSub}>vs. {stats.manualDays} days manual</span>
            </div>

            <div className={styles.metricTile}>
              <span className={styles.mLabel}>FALL RISK INCIDENTS</span>
              <div className={styles.mValGreen}>0 RISK</div>
              <span className={styles.mSub}>100% Ground Telemetry</span>
            </div>

            <div className={styles.metricTile}>
              <span className={styles.mLabel}>MATERIAL SAVED</span>
              <div className={styles.mVal}>
                <AnimatedCounter value={stats.paintSavedLiters} /> L
              </div>
              <span className={styles.mSub}>Reduced overspray</span>
            </div>

            <div className={styles.metricTile}>
              <span className={styles.mLabel}>TURNAROUND SPEED</span>
              <div className={styles.mValHighlight}>
                <AnimatedCounter value={stats.daysSaved} /> Days Saved
              </div>
              <span className={styles.mSub}>Faster tenant handover</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
