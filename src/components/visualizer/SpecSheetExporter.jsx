import React from 'react';
import { FileText, Download, Image as ImageIcon, Save, FolderOpen } from 'lucide-react';
import styles from './SpecSheetExporter.module.css';

export const SpecSheetExporter = ({
  onExportSpecSheet,
  onExportRender,
  onSaveProject,
  onOpenProject
}) => {
  return (
    <div className={styles.dockWrapper}>
      {/* 1. High-Res Image Render Export */}
      <button
        type="button"
        className={`${styles.actionBtn} ${styles.primaryBtn}`}
        onClick={() => onExportRender && onExportRender('png')}
        title="Export full-resolution painted photograph (PNG)"
      >
        <ImageIcon size={14} className={styles.icon} />
        <span className={styles.btnText}>EXPORT RENDER (PNG)</span>
        <Download size={13} className={styles.endIcon} />
      </button>

      {/* 2. Architectural Spec Sheet */}
      <button
        type="button"
        className={styles.actionBtn}
        onClick={onExportSpecSheet}
        title="Download architectural spec sheet markdown summary (AIA MasterFormat compliant)"
      >
        <FileText size={14} className={styles.icon} />
        <span className={styles.btnText}>SPEC SHEET (MD)</span>
        <Download size={13} className={styles.endIcon} />
      </button>

      {/* 3. Project Persistence (Save & Open) */}
      <div className={styles.projectGroup}>
        <button
          type="button"
          className={styles.projectBtn}
          onClick={onSaveProject}
          title="Save project state to .vannam file"
        >
          <Save size={13} />
          <span>SAVE PROJECT</span>
        </button>

        <button
          type="button"
          className={styles.projectBtn}
          onClick={onOpenProject}
          title="Open saved .vannam project file"
        >
          <FolderOpen size={13} />
          <span>OPEN</span>
        </button>
      </div>
    </div>
  );
};

export default SpecSheetExporter;
