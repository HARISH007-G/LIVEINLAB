import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { curatedPaintDatabase, BRANDS } from '../data/paintDatabase';
import ColorSpecimenCard from '../components/ColorSpecimenCard';
import styles from './Products.module.css';

const BRANDS_LIST = ['All Brands', ...BRANDS];
const FINISH_LIST = ['All Finishes', 'Matte', 'Satin', 'High Gloss', 'Eggshell', 'Pearl', 'Ultra Matte'];
const TONES_LIST = ['All Tones', 'Neutral', 'Blue', 'Green', 'Yellow', 'Orange', 'Red', 'Violet'];

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedFinish, setSelectedFinish] = useState('All Finishes');
  const [selectedTone, setSelectedTone] = useState('All Tones');

  const filteredColors = useMemo(() => {
    return curatedPaintDatabase.filter(c => {
      const matchBrand = selectedBrand === 'All Brands' || c.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchFinish = selectedFinish === 'All Finishes' || (c.finish && c.finish.toLowerCase().includes(selectedFinish.toLowerCase()));
      const matchTone = selectedTone === 'All Tones' || c.tone.toLowerCase() === selectedTone.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchQuery = !query || c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query) || c.hex.toLowerCase().includes(query);
      return matchBrand && matchFinish && matchTone && matchQuery;
    });
  }, [searchQuery, selectedBrand, selectedFinish, selectedTone]);

  const handleTestInVisualizer = (color) => {
    const params = new URLSearchParams({
      color: color.hex,
      code: color.code,
      name: color.name,
      brand: color.brand
    });
    navigate(`/visualizer?${params.toString()}`);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Blueprint Grid */}
      <div className="blueprint-grid"></div>

      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.repoBadge}>
              <span className={styles.pulseDot}></span>
              <span className={styles.repoText}>Global Architectural Shade Repository</span>
            </div>

            <h1 className={styles.heroTitle}>
              THE VANNAM<br />
              <span>COLOR LIBRARY</span>
            </h1>

            <p className={styles.heroLead}>
              Explore verified, precision-engineered architectural coatings. Each shade specimen includes LRV metrics, authentic finish designations, and instant studio testing.
            </p>

            {/* 4-Col Stats Row */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statVal}>6,000+</span>
                <span className={styles.statLabel}>Verified Shades</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statVal}>05</span>
                <span className={styles.statLabel}>Architectural Brands</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statVal}>14</span>
                <span className={styles.statLabel}>Finish Formulations</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statVal}>&lt; 0.5 ΔE</span>
                <span className={styles.statLabel}>Robotic Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY FILTER & SEARCH BAR */}
      <section className={styles.filterBarSection}>
        <div className={`container ${styles.filterBarInner}`}>
          {/* Brand Filter Tabs */}
          <div className={styles.filterTabs}>
            {BRANDS_LIST.map((brand) => (
              <button
                key={brand}
                type="button"
                className={`${styles.filterTabBtn} ${selectedBrand === brand ? styles.filterTabActive : ''}`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className={styles.searchWrap}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>search</span>
            <input
              type="text"
              placeholder="Search shade name, #HEX, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SPECIMEN GRID */}
      <section className={styles.productsGridSection}>
        <div className="container">
          <div className={styles.resultsMetaRow}>
            <span className={styles.resultsCount}>
              Showing <strong>{filteredColors.length}</strong> architectural shade specimens
            </span>
          </div>

          <div className={styles.productsGrid}>
            {filteredColors.map((color) => (
              <ColorSpecimenCard
                key={`${color.brand}-${color.code}`}
                color={color}
                onTestInStudio={handleTestInVisualizer}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
