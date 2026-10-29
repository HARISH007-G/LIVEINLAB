import React from 'react';
import { Sunrise, Sun, Sunset, Moon, Bot, Square, Play } from 'lucide-react';
import styles from './HeliostatBar.module.css';

export const HeliostatBar = ({
  activeLighting = 'midday',
  onSelectLighting,
  isRoverSimulating = false,
  onToggleRoverSimulation
}) => {
  const lightingPresets = [
    {
      id: 'morning',
      name: 'Sunrise',
      kelvin: '5500K',
      elevation: '18° ELEV',
      icon: Sunrise
    },
    {
      id: 'midday',
      name: 'Midday',
      kelvin: '6500K',
      elevation: '72° ZENITH',
      icon: Sun
    },
    {
      id: 'goldenHour',
      name: 'Golden',
      kelvin: '3000K',
      elevation: '09° HORIZ',
      icon: Sunset
    },
    {
      id: 'evening',
      name: 'Interior',
      kelvin: '2700K',
      elevation: '00° DIFFUSE',
      icon: Moon
    }
  ];

  return (
    <div className={styles.topControlToolbar}>
      {/* Heliostat Solar Preset Controls */}
      <div className={styles.lightingGroup}>
        <div className={styles.heliostatLabel}>
          <Sun size={13} className={styles.sunIcon} />
          <span>HELIOSTAT:</span>
        </div>

        <div className={styles.presetsStrip}>
          {lightingPresets.map((preset) => {
            const Icon = preset.icon;
            const isActive = activeLighting === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`${styles.lightTabBtn} ${isActive ? styles.lightTabActive : ''}`}
                onClick={() => onSelectLighting(preset.id)}
              >
                <Icon size={14} className={styles.tabIcon} />
                <span className={styles.presetName}>{preset.name}</span>
                <span className={styles.kelvinTag}>{preset.kelvin}</span>
                <span className={styles.elevationTag}>{preset.elevation}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Autonomous Rover Spray Simulator Trigger */}
      <button
        type="button"
        className={`${styles.roverSimBtn} ${isRoverSimulating ? styles.roverSimBtnActive : ''}`}
        onClick={onToggleRoverSimulation}
        title="Simulate autonomous negative-pressure climbing rover deposition"
      >
        <span className={styles.roverIconWrap}>
          {isRoverSimulating ? (
            <Square size={13} className={styles.activeStopIcon} />
          ) : (
            <Bot size={14} />
          )}
        </span>
        <span className={styles.roverBtnText}>
          {isRoverSimulating ? 'HALT ROVER SIM' : 'SIMULATE ROVER PATH'}
        </span>
        {isRoverSimulating && <span className={styles.livePulseDot} />}
      </button>
    </div>
  );
};

export default HeliostatBar;
