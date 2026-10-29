import React from 'react';
import { motion } from 'framer-motion';
import {
  Wand2,
  Brush,
  Eraser,
  ScanSearch,
  Undo2,
  Redo2,
  Layers,
  Bug,
  GalleryHorizontal,
  Sparkles,
  Sliders
} from 'lucide-react';
import styles from './InstrumentDock.module.css';

export const InstrumentDock = ({
  activeTool = 'smart-brush',
  isAddingSurface = false,
  showMask = false,
  debugMode = false,
  isReviewMode = false,
  onSelectTool,
  onUndo,
  onRedo,
  onToggleMask,
  onToggleDebug,
  onToggleReview,
  onRefineMask
}) => {
  const tools = [
    {
      id: 'smart-brush',
      name: 'Smart',
      hotkey: 'S',
      icon: Sparkles,
      desc: 'Smart Brush — Edge-bounded snap coating'
    },
    {
      id: 'brush',
      name: 'Brush',
      hotkey: 'B',
      icon: Brush,
      desc: 'Paint Brush — Freehand coating'
    },
    {
      id: 'wand',
      name: 'Wand',
      hotkey: 'W',
      icon: Wand2,
      desc: 'Magic Wand — Planar boundary fill'
    },
    {
      id: 'eraser',
      name: 'Erase',
      hotkey: 'E',
      icon: Eraser,
      desc: 'Eraser — Edge-aware mask restore'
    },
    {
      id: 'loupe',
      name: 'Loupe',
      hotkey: 'L',
      icon: ScanSearch,
      desc: 'Optical Loupe — 2.5x micro-grain inspection'
    }
  ];

  return (
    <div className={styles.dockContainer}>
      <span className={styles.sectionMiniTag}>INSTRUMENT DOCK</span>

      {/* Main 4 Precision Tools */}
      <div className={styles.toolsGrid}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id && !isAddingSurface;
          return (
            <motion.button
              key={tool.id}
              type="button"
              className={`${styles.toolBtn} ${isActive ? styles.toolActive : ''}`}
              onClick={() => onSelectTool(tool.id)}
              title={tool.desc}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isActive && <span className={styles.ledIndicator} />}
              <Icon size={16} className={styles.toolIcon} />
              <div className={styles.labelCol}>
                <span className={styles.toolName}>{tool.name}</span>
                <kbd className={styles.keyBadge}>{tool.hotkey}</kbd>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Auxiliary Studio Actions Row */}
      <div className={styles.auxActionsRow}>
        <button
          type="button"
          className={styles.auxBtn}
          onClick={onUndo}
          title="Undo Action (Ctrl+Z)"
        >
          <Undo2 size={14} />
        </button>

        <button
          type="button"
          className={styles.auxBtn}
          onClick={onRedo}
          title="Redo Action (Ctrl+Y)"
        >
          <Redo2 size={14} />
        </button>

        <div className={styles.divider} />

        <button
          type="button"
          className={`${styles.auxBtn} ${showMask ? styles.auxBtnActive : ''}`}
          onClick={onToggleMask}
          title="Toggle Active Mask Glow Overlay"
        >
          <Layers size={14} />
        </button>

        <button
          type="button"
          className={`${styles.auxBtn} ${debugMode ? styles.auxBtnActive : ''}`}
          onClick={onToggleDebug}
          title="Toggle LiDAR Protected Boundary Debugging"
        >
          <Bug size={14} />
        </button>

        <button
          type="button"
          className={`${styles.auxBtn} ${isReviewMode ? styles.auxBtnActive : ''}`}
          onClick={onToggleReview}
          title="Filmstrip Review Detected Surfaces"
        >
          <GalleryHorizontal size={14} />
        </button>

        {onRefineMask && (
          <button
            type="button"
            className={styles.auxBtn}
            onClick={onRefineMask}
            title="Refine Active Mask (Edge Snap & Fill Pinhole Gaps)"
          >
            <Sliders size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InstrumentDock;
