import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sparkles } from 'lucide-react';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <div className="container">
        <div className={styles.contentCard}>
          <span className={styles.code}>404</span>
          <h1 className="title-gradient">This Wall Doesn't Exist</h1>
          <p>The facade or architectural path you are looking for has been relocated or does not exist.</p>
          <div className={styles.btnRow}>
            <Link to="/" className="btn-primary">
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
            <Link to="/visualizer" className="btn-secondary">
              <Sparkles size={16} />
              <span>Open Visualizer Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
