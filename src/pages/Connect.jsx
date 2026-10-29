import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Bot,
  Satellite,
  Activity,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
  ShieldCheck,
  Building2,
  HelpCircle
} from 'lucide-react';
import RoiCalculator from '../components/RoiCalculator';
import styles from './Connect.module.css';

const ROBOT_ARM_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD4aqcXAh72Be83eMHhfO6st8W0hwMVle2nBFHZEOwfeYZxk7YdHWpleH84PBHyRo2pUx5p-zE9JEf1f_66oYsHSweqd1NhhnPqwGE2v-jS-xL2NGiXSl3wcceLyViMlG6ZSHMPceNCqTSsCm4jkXtBDGxtm93k-8-j8JSF35Y1Qtoc69SEBVf6kUQ7mx7vYf6kKH0LgM9h3g70YaO8_QLTNMVb-9rmX4EZOwCxBbcUd1L8UXYmZBSr';

const FAQ_LIST = [
  {
    q: 'What are the site requirements for Rover deployment?',
    a: 'The site requires a flat staging area of 10x10 meters, a dedicated 3-phase power supply (400V, 63A minimum), and stable 4G/5G or Starlink connectivity for remote telemetry. Site leveling within 2 degrees is mandatory for optimal calibration.'
  },
  {
    q: 'How accurate is the material deposition?',
    a: 'Vannam Rovers operate with a precision tolerance of ±2mm per meter. Our proprietary closed-loop feedback system uses LiDAR and computer vision to adjust deposition rates in real-time, accounting for environmental factors like temperature and humidity.'
  },
  {
    q: 'What is the typical lead time for a project start?',
    a: 'Standard deployment lead time is 4-6 weeks from signed contract to site mobilization. This includes software simulation of your design, material testing for local mix aggregates, and hardware shipping.'
  },
  {
    q: 'Can the Rover system operate in extreme weather conditions?',
    a: 'Vannam Rovers are IP65 rated with active thermal regulation, capable of operating in ambient temperatures from -10°C to +48°C. Deposition pauses automatically if wind speeds exceed 45 km/h for safety.'
  }
];

const Connect = () => {
  const [contactName, setContactName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [projectClassification, setProjectClassification] = useState('COMMERCIAL');
  const [totalArea, setTotalArea] = useState(1200); // SQM
  const [maxHeight, setMaxHeight] = useState(12); // M
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Real-Time Calculations from simulation logic
  const estimates = useMemo(() => {
    const days = Math.floor(totalArea * 0.04 + maxHeight * 0.8);
    const vol = Math.floor(totalArea * maxHeight * 0.085);
    const nrg = (vol * 0.016).toFixed(1);
    const progressWidth = Math.min(100, Math.max(20, (days / 80) * 100));

    let tier = 'COMMERCIAL CLASS';
    if (maxHeight > 25 || totalArea > 4000) {
      tier = 'ENTERPRISE CLASS';
    } else if (maxHeight > 15) {
      tier = 'INFRASTRUCTURE CLASS';
    }

    return { days, vol, nrg, progressWidth, tier };
  }, [totalArea, maxHeight]);

  const handleInitiate = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Blueprint Grid Background */}
      <div className="blueprint-grid" />

      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroGrid}`}>
          {/* Left Column: Headline & Intake Badge */}
          <div className={styles.heroLeft}>
            <div className={styles.intakeBadge}>
              <span className={styles.pulseDot} />
              <span className={styles.intakeText}>AUTONOMOUS DEPLOYMENT PROTOCOL</span>
              <span className={styles.protocolId}>REV 3.4</span>
            </div>

            <h1 className={styles.heroTitle}>
              LET'S BUILD<br />
              <span>THE NEXT WALL.</span>
            </h1>

            <p className={styles.heroLead}>
              Configure your architectural parameters below. Our autonomous vertical surface rovers
              calculate precise material volumes, energy requirements, and execution timelines in real-time.
            </p>

            {/* Decorative Cad Coordinate Ruler */}
            <div className={styles.decRuler}>
              <div className={styles.rulerTicks}>
                <span /><span /><span /><span /><span /><span /><span /><span />
              </div>
              <span className={styles.rulerLabel}>CAD CALIBRATION MATRIX • ACCURACY ±2mm</span>
            </div>
          </div>

          {/* Right Column: Robotic Arm Visual Card */}
          <div className={styles.heroRight}>
            <div className={styles.armVisualCard}>
              <img
                src={ROBOT_ARM_IMG}
                alt="Robotic Construction Arm"
                className={styles.armImg}
              />
              <div className={styles.armGradientOverlay} />

              {/* Data Rings & Hologram Reticles */}
              <div className={styles.dataRings}>
                <svg className={styles.ringSvg} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeDasharray="20 10" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeDasharray="6 6" strokeWidth="1" />
                </svg>
              </div>

              {/* Telemetry Badge on Image */}
              <div className={styles.armTelemetryBadge}>
                <Activity size={12} className={styles.badgePulseIcon} />
                <span>ROVER V3 • READY FOR FIELD MOBILIZATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROI & COST SAVINGS CALCULATOR */}
      <section className={styles.calculatorSection}>
        <div className="container">
          <RoiCalculator />
        </div>
      </section>

      {/* 3. MAIN FORM & LIVE ESTIMATOR SECTION */}
      <section className={styles.formSection}>
        <div className={`container ${styles.formGrid}`}>
          {/* Left Column: Form Card */}
          <div className={styles.formCol}>
            <div className={styles.formGlassCard}>
              <div className={styles.formCardHeader}>
                <div className={styles.formHeaderTitleGroup}>
                  <Cpu size={18} className={styles.headerIcon} />
                  <h2 className={styles.formHeaderTitle}>PROJECT PARAMETERS</h2>
                </div>
                <span className={styles.stepTag}>STEP 01 • INTAKE</span>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleInitiate} className={styles.paramForm}>
                  {/* Two-Column Inputs */}
                  <div className={styles.formTwoCol}>
                    <div className={styles.inputGroup}>
                      <label className={styles.fieldLabel}>LEAD ARCHITECT / CONTACT</label>
                      <input
                        type="text"
                        placeholder="e.g. Ar. Rajesh Sharma"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className={styles.textInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.fieldLabel}>FIRM / ORGANIZATION</label>
                      <input
                        type="text"
                        placeholder="e.g. Studio Morphogenesis"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        required
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  {/* Project Classification Radio Cards */}
                  <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>PROJECT CLASSIFICATION</label>
                    <div className={styles.radioGrid}>
                      {['COMMERCIAL', 'INFRASTRUCTURE', 'RESIDENTIAL', 'AEROSPACE'].map((type) => {
                        const isSelected = projectClassification === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            className={`${styles.radioCard} ${isSelected ? styles.radioSelected : ''}`}
                            onClick={() => setProjectClassification(type)}
                          >
                            <Building2 size={13} className={styles.radioIcon} />
                            <span>{type}</span>
                            {isSelected && <span className={styles.radioDot} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Range Sliders */}
                  <div className={styles.formTwoCol}>
                    {/* Area Slider */}
                    <div className={styles.inputGroup}>
                      <div className={styles.sliderLabelRow}>
                        <span className={styles.fieldLabel}>TOTAL AREA (SQM)</span>
                        <span className={styles.primaryVal}>{totalArea.toLocaleString()} m²</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={totalArea}
                        onChange={(e) => setTotalArea(parseInt(e.target.value, 10))}
                        className={styles.rangeBar}
                      />
                      <div className={styles.rangeLimits}>
                        <span>100 m²</span>
                        <span>10,000 m²</span>
                      </div>
                    </div>

                    {/* Height Slider */}
                    <div className={styles.inputGroup}>
                      <div className={styles.sliderLabelRow}>
                        <span className={styles.fieldLabel}>MAX HEIGHT (M)</span>
                        <span className={styles.primaryVal}>{maxHeight} METERS</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="50"
                        step="1"
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(parseInt(e.target.value, 10))}
                        className={styles.rangeBar}
                      />
                      <div className={styles.rangeLimits}>
                        <span>3 m</span>
                        <span>50 m</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className={styles.initiateBtn}>
                    <span>INITIATE DEPLOYMENT SIMULATION</span>
                    <ArrowRight size={16} className={styles.btnArrow} />
                  </button>
                </form>
              ) : (
                /* Success Confirmation State */
                <div className={styles.submittedBox}>
                  <CheckCircle2 size={44} className={styles.successIcon} />
                  <h3 className={styles.successTitle}>Simulation Protocol Dispatched</h3>
                  <p className={styles.successDesc}>
                    Reference <strong>VN-{Math.floor(100000 + Math.random() * 900000)}</strong> has been registered.
                    Preliminary analysis projects <strong>{estimates.days} operational days</strong> for{' '}
                    <strong>{totalArea} m²</strong> of surface area.
                  </p>
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => setIsSubmitted(false)}
                  >
                    Adjust Parameters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Estimator Telemetry Card */}
          <div className={styles.estimatorCol}>
            <div className={styles.estimatorCard}>
              {/* Header */}
              <div className={styles.estCardHeader}>
                <div className={styles.estHeaderLeft}>
                  <Activity size={16} className={styles.estPulseIcon} />
                  <span className={styles.estHeaderTitle}>LIVE TELEMETRY ESTIMATOR</span>
                </div>
                <div className={styles.syncedBadge}>
                  <span className={styles.syncDot} />
                  <span>SYNCED</span>
                </div>
              </div>

              <div className={styles.estCardBody}>
                {/* Project Tier Box */}
                <div className={styles.tierBox}>
                  <span className={styles.estSubLabel}>PROJECT CLASSIFICATION TIER</span>
                  <div className={styles.estTierValue}>
                    <span className={styles.primaryTierName}>{estimates.tier}</span>
                  </div>
                </div>

                {/* Required Hardware Suite */}
                <div className={styles.hardwareSection}>
                  <span className={styles.estSubLabel}>DEPLOYMENT HARDWARE MANIFEST</span>

                  <div className={styles.hardwareCard}>
                    <div className={styles.hardwareIconBox}>
                      <Bot size={18} />
                    </div>
                    <div className={styles.hardwareTextCol}>
                      <h4>VANNAM ROVER V3</h4>
                      <p>Negative-pressure vacuum climbing chassis with dual-feed nozzle.</p>
                    </div>
                  </div>

                  <div className={styles.hardwareCard}>
                    <div className={styles.hardwareIconBox}>
                      <Satellite size={18} />
                    </div>
                    <div className={styles.hardwareTextCol}>
                      <h4>REMOTE TELEMETRY BRIDGE</h4>
                      <p>Ultra-low-latency 5G / Starlink encrypted telemetry link.</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className={styles.timelineSection}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.estSubLabel}>ESTIMATED DURATION</span>
                    <div className={styles.timelineDays}>
                      <span className={styles.daysNumber}>{estimates.days}</span>
                      <span className={styles.daysText}>DAYS</span>
                    </div>
                  </div>
                  <div className={styles.timelineProgressBar}>
                    <div
                      className={styles.timelineProgressFill}
                      style={{ width: `${estimates.progressWidth}%` }}
                    />
                  </div>
                  <div className={styles.timelineMeta}>
                    <span>Continuous automated execution</span>
                    <span>24/7 Precision cycle</span>
                  </div>
                </div>

                {/* Dual Metrics */}
                <div className={styles.dualMetricsGrid}>
                  <div className={styles.metricCardBox}>
                    <div className={styles.metricCardTop}>
                      <Layers size={13} className={styles.metricIcon} />
                      <span className={styles.metricCardLabel}>MATERIAL VOL</span>
                    </div>
                    <span className={styles.metricCardValue}>{estimates.vol} m³</span>
                    <span className={styles.metricSub}>±1.5% coating margin</span>
                  </div>

                  <div className={styles.metricCardBox}>
                    <div className={styles.metricCardTop}>
                      <Zap size={13} className={styles.metricIcon} />
                      <span className={styles.metricCardLabel}>ENERGY REQ</span>
                    </div>
                    <span className={styles.metricCardValue}>{estimates.nrg} MWh</span>
                    <span className={styles.metricSub}>3-phase 400V staging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEPLOYMENT PROTOCOL FAQ ACCORDION */}
      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqInner}>
            <div className={styles.faqHeader}>
              <HelpCircle size={20} className={styles.faqHeaderIcon} />
              <h3 className={styles.faqTitle}>
                DEPLOYMENT <span>PROTOCOL FAQ</span>
              </h3>
            </div>
            <p className={styles.faqLead}>
              Detailed operational requirements for robotics site mobilization, safety envelopes, and lead times.
            </p>

            <div className={styles.faqList}>
              {FAQ_LIST.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`${styles.faqItemCard} ${isOpen ? styles.faqItemOpen : ''}`}
                  >
                    <button
                      type="button"
                      className={styles.faqQuestionBtn}
                      onClick={() => setOpenFaq((prev) => (prev === idx ? null : idx))}
                    >
                      <span className={styles.faqQuestionText}>{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotate : ''}`}
                      />
                    </button>

                    {isOpen && (
                      <div className={styles.faqAnswerBox}>
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Connect;
