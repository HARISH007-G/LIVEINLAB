import React from 'react';
import { FINISH_PRESETS } from '../../utils/textureEngine';
import styles from './MaterialFinishTiles.module.css';

export const MaterialFinishTiles = ({
  activeFinish = 'matte',
  onSelectFinish
}) => {
  const finishKeys = ['matte', 'satin', 'gloss', 'stucco'];

  return (
    <div className={styles.finishSection}>
      <div className={styles.finishHeader}>
        <span className={styles.sectionMiniTag}>TACTILE MATERIAL FINISH</span>
        <span className={styles.subTag}>PHYSICAL SHEEN MAP</span>
      </div>

      <div className={styles.finishGrid}>
        {finishKeys.map((key) => {
          const finish = FINISH_PRESETS[key] || { name: key, sheen: 25 };
          const isActive = activeFinish === key;

          return (
            <button
              key={key}
              type="button"
              className={`${styles.finishBtn} ${styles[`finish_${key}`]} ${
                isActive ? styles.finishBtnActive : ''
              }`}
              onClick={() => onSelectFinish(key)}
              title={finish.description || finish.name}
            >
              <div className={styles.finishSheenGloss} />
              <span className={styles.finishName}>{finish.name}</span>
              <span className={styles.finishSheen}>{finish.sheen}% Sheen</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialFinishTiles;
