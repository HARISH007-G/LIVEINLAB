import React, { useState, useMemo } from 'react';
import { Check, Search, Sparkles } from 'lucide-react';
import styles from './FanDeckMatrix.module.css';

export const FanDeckMatrix = ({
  brands = [],
  selectedBrand = 'Asian Paints',
  filteredSwatches = [],
  selectedColor,
  onSelectBrand,
  onSelectColor
}) => {
  const [toneFilter, setToneFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tones = [
    { id: 'all', label: 'All' },
    { id: 'neutral', label: 'Neutrals' },
    { id: 'blue', label: 'Blues' },
    { id: 'green', label: 'Greens' },
    { id: 'yellow', label: 'Yellows' },
    { id: 'orange', label: 'Oranges' },
    { id: 'red', label: 'Reds' },
    { id: 'violet', label: 'Violets' }
  ];

  // Filter swatches by selected tone and search query within the active brand
  const visibleSwatches = useMemo(() => {
    return filteredSwatches.filter((color) => {
      const matchTone = toneFilter === 'all' || color.tone?.toLowerCase() === toneFilter.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        color.name.toLowerCase().includes(q) ||
        color.code.toLowerCase().includes(q) ||
        color.hex.toLowerCase().includes(q);
      return matchTone && matchQuery;
    });
  }, [filteredSwatches, toneFilter, searchQuery]);

  return (
    <div className={styles.fanDeckContainer}>
      {/* Header with Title & Specimen Count */}
      <div className={styles.deckHeader}>
        <div className={styles.titleWithIcon}>
          <Sparkles size={11} className={styles.sparkleIcon} />
          <span className={styles.sectionMiniTag}>ARCHITECTURAL FAN-DECK</span>
        </div>
        <span className={styles.countBadge}>{visibleSwatches.length} SHADES</span>
      </div>

      {/* Brand Horizontal Scrollable Tabs */}
      <div className={styles.brandTabsWrapper}>
        <div className={styles.brandTabs}>
          {brands.map((brand) => {
            const isActive = selectedBrand.toLowerCase() === brand.toLowerCase();
            return (
              <button
                key={brand}
                type="button"
                className={`${styles.brandTabBtn} ${isActive ? styles.brandActive : ''}`}
                onClick={() => {
                  onSelectBrand(brand);
                  setSearchQuery('');
                }}
              >
                <span>{brand}</span>
                {isActive && <span className={styles.activeUnderline} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Tone Filter Bar */}
      <div className={styles.filterRow}>
        <div className={styles.searchBox}>
          <Search size={11} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search shade or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tonePills}>
          {tones.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.tonePill} ${toneFilter === t.id ? styles.tonePillActive : ''}`}
              onClick={() => setToneFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Swatch Grid */}
      <div className={styles.swatchGrid}>
        {visibleSwatches.map((color) => {
          const isSelected = selectedColor?.hex?.toLowerCase() === color.hex?.toLowerCase();
          return (
            <button
              key={`${color.brand}-${color.code}`}
              type="button"
              className={`${styles.swatchBtn} ${isSelected ? styles.swatchBtnSelected : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => onSelectColor(color)}
              title={`${color.name} (${color.code}) • ${color.brand} • ${color.finish || 'Matte'}`}
            >
              <div className={styles.swatchSpecularGleam} />
              <div className={styles.hoverMetaPill}>
                <span className={styles.hoverCode}>{color.code}</span>
              </div>
              {isSelected && (
                <div className={styles.checkWrapper}>
                  <Check size={12} className={styles.swatchCheck} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FanDeckMatrix;
