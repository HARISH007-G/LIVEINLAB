import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/visualizer')) {
    return null;
  }
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.statusGroup}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>VANNAM ROVER TELEMETRY: ONLINE</span>
        </div>
        <div className={styles.legalGroup}>
          <a href="#" className={styles.legalLink}>Privacy</a>
          <a href="#" className={styles.legalLink}>Systems</a>
          <a href="#" className={styles.legalLink}>Legal</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
