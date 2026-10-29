import React from 'react';
import styles from './PartnerMarquee.module.css';

const PARTNERS = [
  { name: 'Asian Paints', type: 'Global Color Standard' },
  { name: 'Dulux AkzoNobel', type: 'Architectural Coatings' },
  { name: 'Sherwin-Williams', type: 'Industrial Protection' },
  { name: 'Berger Paints', type: 'High-Performance Finishes' },
  { name: 'Nippon Paint', type: 'Advanced Polymers' },
  { name: 'Larsen & Toubro', type: 'Infrastructure Partner' },
  { name: 'Tata Projects', type: 'High-Rise Construction' },
  { name: 'Shapoorji Pallonji', type: 'Commercial Real Estate' }
];

const PartnerMarquee = () => {
  return (
    <section className={styles.marqueeSection}>
      <div className={styles.marqueeHeader}>
        <span className={styles.marqueeTag}>COMPATIBLE WITH GLOBAL COATINGS & ENTERPRISE CONTRACTORS</span>
      </div>

      <div className={styles.marqueeTrackWrapper}>
        <div className={styles.marqueeTrack}>
          {/* Loop twice for seamless infinite scroll */}
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div key={`${partner.name}-${idx}`} className={styles.partnerCard}>
              <div className={styles.partnerDot}></div>
              <span className={styles.partnerName}>{partner.name}</span>
              <span className={styles.partnerType}>{partner.type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
