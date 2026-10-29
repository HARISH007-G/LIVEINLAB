import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Navbar.module.css';

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAgxAzW3nOEf-MtJNWdAAClRiv7JzcUSt6e5c6YDdf8p5mzDhml02_NB8r1MbnGcKGlQcCc0Imso6q7uSLsaINcXUQ7MStrbCnbc9iX-vJrjPxtiSSPkMBXtOOCZmNncrq8do1soO6aDyewv7v_kkP3oQAXeiAGf8uFTs4GsJ432lcp-fsVefTkRyG2l9NtveJs6QKmRHmw50wiJ6wQTfHCstZL4zB_mFntM1O9hCA7tRvgVohl51RF';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isStudioPage = location.pathname.startsWith('/visualizer');

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'de', label: 'DE' },
    { code: 'es', label: 'ES' }
  ];

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.navBar}>
        {/* Logo */}
        <NavLink to="/" className={styles.logoWrap}>
          <img
            alt="VANNAM Robotics Brand Logo"
            className={styles.brandLogoImg}
            src={LOGO_SRC}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className={styles.titleContainer}>
            <span className={styles.brandTitle}>VANNAM</span>
            <span className={styles.brandSubtitle}>ROBOTICS</span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/visualizer"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Visualizer Studio
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/connect"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Connect
          </NavLink>
        </div>

        {/* Controls: Language, Theme Toggle, and Conditional CTA */}
        <div className={styles.navRight}>
          <div className={styles.localeGroup}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.langSelect}
              aria-label="Language Select"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={styles.themeToggleBtn}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Architectural Light' : 'Studio Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={16} className={styles.themeIconSun} />
              ) : (
                <Moon size={16} className={styles.themeIconMoon} />
              )}
            </button>
          </div>

          {/* Render Launch Studio Button ONLY when NOT on Visualizer page */}
          {!isStudioPage && (
            <NavLink to="/visualizer" className={styles.launchBtn}>
              <span>Launch Studio</span>
              <ArrowRight size={15} />
            </NavLink>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className={styles.mobileTrigger}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to="/" end className={styles.mobileLink}>
            Home
          </NavLink>
          <NavLink to="/products" className={styles.mobileLink}>
            Products
          </NavLink>
          <NavLink to="/visualizer" className={styles.mobileLink}>
            Visualizer Studio
          </NavLink>
          <NavLink to="/about" className={styles.mobileLink}>
            About Us
          </NavLink>
          <NavLink to="/connect" className={styles.mobileLink}>
            Connect
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
