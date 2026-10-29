import React from 'react';
import { Link } from 'react-router-dom';
import BentoGrid from '../components/BentoGrid';
import PartnerMarquee from '../components/PartnerMarquee';
import AnimatedCounter from '../components/AnimatedCounter';
import styles from './Home.module.css';

const ROVER_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8e1xN08GXcK21IFGMBgejK8ebXEX_f3S8F9d-D6X4vCoP4CUvLKW9k0UoZDvJWVapr7m5XFHly2jODtxYPnXz-L_HNqoyc-Bhp-PbPaggX2G2imIBCtp3z92Y2WTyzIIy7jxqHDzBzDxzj36whJiuJz3fKEw1_7DT-GCKJuFG9bpshUBeXcimuRUruZWMi0SCYccztANdI_SgTfMGXeuN8BRzO0jXynyfPghY7wjnDXOVcuQr_4Fn';

const Home = () => {
  return (
    <div className={styles.pageContainer}>
      {/* Blueprint Grid Overlay */}
      <div className="blueprint-grid"></div>

      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroGrid}`}>
          {/* Hero Left Content */}
          <div className={styles.heroLeft}>
            <div className={styles.versionBadge}>
              <span className={styles.pulseDot}></span>
              <span className={styles.versionText}>Autonomous Coating Platform v2.4</span>
            </div>

            <h1 className={styles.heroTitle}>
              SMARTER WALLS.<br />
              SAFER <span className={styles.highlightWord}>HEIGHTS.</span>
            </h1>

            <p className={styles.heroLead}>
              Autonomous vertical painting technology combined with intelligent architectural color visualization. Redefining precision, surface fidelity, and worker safety in large-scale architectural coatings.
            </p>

            <div className={styles.heroBtnGroup}>
              <Link to="/visualizer" className={styles.primaryBtn}>
                <span>Launch Wall Studio</span>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </Link>
              <Link to="/about" className={styles.secondaryBtn}>
                <span>Explore Rover Specs</span>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>precision_manufacturing</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visual with High-Precision Telemetry */}
          <div className={styles.heroRight}>
            <div className={styles.heroImageWrapper}>
              <img
                src={ROVER_IMG}
                alt="VANNAM Autonomous Rover Climbing Wall"
                className={styles.roverImg}
              />

              {/* Technical HUD Top Left */}
              <div className={styles.hudTopLeft}>
                <span className={styles.hudLabel}>Surface Contact</span>
                <span className={styles.hudScore}>
                  <AnimatedCounter value={98.4} decimals={1} suffix="%" />
                </span>
                <div className={styles.hudProgressBar}>
                  <div className={styles.hudProgressFill} style={{ width: '98.4%' }}></div>
                </div>
              </div>

              {/* Technical HUD Bottom Right */}
              <div className={styles.hudBottomRight}>
                <span className={styles.hudLabel}>Telemetry Link</span>
                <span className={styles.hudStatus}>
                  <span className={styles.statusDot}></span> ONLINE 'UTTOV
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE PARTNER MARQUEE */}
      <PartnerMarquee />

      {/* 3. METRICS RIBBON */}
      <section className={styles.metricsSection}>
        <div className={`container ${styles.metricsGrid}`}>
          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <span className="material-symbols-outlined">speed</span>
            </div>
            <div>
              <div className={styles.metricVal}>
                <AnimatedCounter value={10} suffix="x" />
              </div>
              <div className={styles.metricLabel}>Faster Execution</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div>
              <div className={styles.metricVal}>0</div>
              <div className={styles.metricLabel}>Height Risk Incidents</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIconWrap}>
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <div>
              <div className={styles.metricVal}>
                <AnimatedCounter value={94.8} decimals={1} suffix="%" />
              </div>
              <div className={styles.metricLabel}>Material Transfer Efficiency</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURAL BENTO GRID */}
      <BentoGrid />

      {/* 5. PROBLEM VS SOLUTION */}
      <section className={styles.comparisonSection}>
        <div className={`container ${styles.comparisonGrid}`}>
          {/* 01 Archaic Method */}
          <div className={styles.problemCard}>
            <span className={styles.bgNumber}>01</span>
            <span className={styles.subHeader}>The Archaic Method</span>
            <h2 className={styles.compTitle}>Hazardous, manual, and inconsistent.</h2>
            <p className={styles.compDesc}>
              Traditional vertical painting relies on scaffolding, high-altitude human risk, and unpredictable paint thickness. Weather delays and material overspray increase costs and carbon footprints.
            </p>
            <div className={styles.featureList}>
              <div className={styles.featureItemBad}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ef4444' }}>cancel</span>
                <span>Critical fall hazards & worker risk</span>
              </div>
              <div className={styles.featureItemBad}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ef4444' }}>cancel</span>
                <span>Inconsistent micron deposition</span>
              </div>
              <div className={styles.featureItemBad}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ef4444' }}>cancel</span>
                <span>Scaffolding setup delays & structural footprint</span>
              </div>
            </div>
          </div>

          {/* 02 VANNAM Protocol */}
          <div className={styles.solutionCard}>
            <span className={styles.bgNumberCyan}>02</span>
            <span className={styles.subHeaderCyan}>The VANNAM Protocol</span>
            <h2 className={styles.compTitle}>Automated, rapid, and sub-millimeter precise.</h2>
            <p className={styles.compDesc}>
              VANNAM vertical rovers use negative pressure adhesion, dual-axis LiDAR navigation, and automated high-pressure spray delivery to produce flawless architectural coatings in a fraction of the time.
            </p>
            <div className={styles.featureList}>
              <div className={styles.featureItemGood}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>check_circle</span>
                <span>Ground-controlled operation with zero fall risk</span>
              </div>
              <div className={styles.featureItemGood}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>check_circle</span>
                <span>Precision 250 μm automated deposition</span>
              </div>
              <div className={styles.featureItemGood}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>check_circle</span>
                <span>10x rapid deployment with live telemetry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to modernize your architectural coatings?</h2>
          <p className={styles.ctaLead}>
            Test your color palettes in the studio visualizer or schedule a site engineering assessment for autonomous rover deployment.
          </p>
          <div className={styles.heroBtnGroup}>
            <Link to="/visualizer" className={styles.ctaMainBtn}>
              <span>Launch Studio Visualizer</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </Link>
            <Link to="/connect" className={styles.secondaryBtn}>
              <span>Book Deployment Assessment</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>calendar_today</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
