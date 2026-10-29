import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Users
} from 'lucide-react';
import styles from './About.module.css';

const MILESTONES = [
  {
    year: '2024',
    title: 'Concept & Aerodynamic Modeling',
    desc: 'Team Innova18 initiated research into differential vacuum adhesion on porous architectural concrete, proving stable vertical holding force.'
  },
  {
    year: '2025',
    title: 'First Autonomous Climbing Prototype',
    desc: 'Engineered the Mk-I climbing chassis with dual-motor silicone tracks and an integrated high-pressure paint atomizing delivery head.'
  },
  {
    year: '2026',
    title: 'Integrated Platform & Digital Visualizer',
    desc: 'Unified the physical rover hardware with our client-side computer vision wall visualizer, enabling instant preview-to-paint synchronization.'
  },
  {
    year: 'Next',
    title: 'Fleet Autonomy & Multi-Rover Deployment',
    desc: 'Developing synchronized multi-rover facade coordination for commercial high-rises and automated paint-mixing docking stations.'
  }
];

const CORE_PRINCIPLES = [
  {
    icon: <ShieldCheck size={28} className={styles.principleIcon} />,
    title: 'Human Safety First',
    desc: 'Eliminating the perilous practice of suspending manual human crews from dangerous high-altitude scaffolding.'
  },
  {
    icon: <Cpu size={28} className={styles.principleIcon} />,
    title: 'Sub-Millimeter Precision',
    desc: 'Micro-actuator spray heads calibrate paint deposition with micron-level consistency across complex textures.'
  },
  {
    icon: <Layers size={28} className={styles.principleIcon} />,
    title: 'Digital-Physical Bridge',
    desc: 'Seamlessly transforming virtual pixel mockups into real-world robotic spray paths with zero color deviation.'
  },
  {
    icon: <HeartHandshake size={28} className={styles.principleIcon} />,
    title: 'Contractor Empowerment',
    desc: 'Empowering painting contractors and applicators to complete projects 10x faster with dramatically reduced insurance overhead.'
  }
];

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* 1. HERO SECTION */}
      <section className={styles.aboutHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Users size={15} />
              <span>TEAM INNOVA18 • ROBOTICS LABS</span>
            </div>
            <h1 className="title-gradient">Pioneering the Future of Vertical Robotics</h1>
            <p className={styles.heroLead}>
              Vannam was born from a fundamental observation: while digital design tools have evolved rapidly, commercial exterior painting remained dangerous, slow, and labor-intensive. We engineered the solution.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE MISSION & ORIGIN */}
      <section className={styles.missionSection}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <span className="badge-tech">THE PROBLEM</span>
              <h2>A Century-Old Risk</h2>
              <p>
                Every year, thousands of construction and painting workers suffer severe injuries or fatal falls from scaffolding, ladders, and suspended platforms. Traditional scaffolding takes days to construct, incurs massive rental costs, and leaves applicators vulnerable to unpredictable high-altitude wind gusts.
              </p>
            </div>

            <div className={styles.missionCard}>
              <span className="badge-tech">OUR SOLUTION</span>
              <h2>The Robotic Ascent</h2>
              <p>
                Team Innova18 designed the Vannam vertical climbing rover: a lightweight, suction-adhered robotic applicator controlled safely from the ground. Paired with our intelligent digital visualizer, architects and building owners can preview verified colors instantly and deploy autonomous precision painting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TIMELINE & MILESTONES */}
      <section className={styles.timelineSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge-tech">ENGINEERING JOURNEY</span>
            <h2 className="title-gradient">Milestones in Innovation</h2>
            <p className={styles.sectionLead}>
              From early fluid dynamics laboratory experiments to commercial facade deployments.
            </p>
          </div>

          <div className={styles.timelineGrid}>
            {MILESTONES.map((item, idx) => (
              <div key={idx} className={styles.timelineCard}>
                <div className={styles.timelineYear}>{item.year}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE PRINCIPLES */}
      <section className={styles.principlesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge-tech">GUIDING PILLARS</span>
            <h2 className="title-gradient">Core Engineering Principles</h2>
          </div>

          <div className={styles.principlesGrid}>
            {CORE_PRINCIPLES.map((principle, idx) => (
              <div key={idx} className={styles.principleCard}>
                <div className={styles.iconWrap}>{principle.icon}</div>
                <h3>{principle.title}</h3>
                <p>{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>Experience the Future of Wall Visualization</h2>
            <p>Test real manufacturer shades on your building walls or request a commercial robotic deployment.</p>
            <div className={styles.ctaBtns}>
              <Link to="/visualizer" className="btn-primary">
                <Sparkles size={18} />
                <span>Launch Wall Visualizer</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/connect" className="btn-secondary">
                <span>Contact Engineering Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
