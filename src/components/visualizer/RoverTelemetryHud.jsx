import React from 'react';
import { Activity } from 'lucide-react';
import styles from './RoverTelemetryHud.module.css';

export const RoverTelemetryHud = ({
  isRoverSimulating = false,
  roverTelemetry = null
}) => {
  if (!isRoverSimulating || !roverTelemetry) return null;

  return (
    <div className={styles.roverTelemetryOverlay}>
      <div className={styles.telemetryTitle}>
        <span className={styles.hudDot} />
        <Activity size={12} className={styles.activityIcon} />
        <span className={styles.titleText}>AUTONOMOUS ROVER TELEMETRY</span>
        <span className={styles.liveTag}>LIVE</span>
      </div>

      <div className={styles.telemetryGrid}>
        <div className={styles.telemetryItem}>
          <span className={styles.telLabel}>VACUUM ADHESION:</span>
          <span className={styles.telValGreen}>98.4% LOCKED</span>
        </div>

        <div className={styles.telemetryItem}>
          <span className={styles.telLabel}>DEPOSITION:</span>
          <span className={styles.telVal}>
            {roverTelemetry.depositionMicrons || 250} μm (±3 μm)
          </span>
        </div>

        <div className={styles.telemetryItem}>
          <span className={styles.telLabel}>FLUIDICS:</span>
          <span className={styles.telVal}>
            {roverTelemetry.pressureBar || 180} BAR
          </span>
        </div>

        <div className={styles.telemetryItem}>
          <span className={styles.telLabel}>RASTER CYCLE:</span>
          <span className={styles.telVal}>
            {roverTelemetry.currentPass || 1} / {roverTelemetry.totalPasses || 3}
          </span>
        </div>
      </div>

      <div className={styles.telemetryCoordsRow}>
        <span>X: {roverTelemetry.xMeters || '04.82'}m</span>
        <span>Y: {roverTelemetry.yMeters || '12.14'}m</span>
        <span>Z: 02.40m</span>
        <span className={styles.speedTag}>0.82 m/s</span>
      </div>
    </div>
  );
};

export default RoverTelemetryHud;
