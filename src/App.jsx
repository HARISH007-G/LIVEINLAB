import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Visualizer from './pages/Visualizer';
import Products from './pages/Products';
import About from './pages/About';
import Connect from './pages/Connect';
import NotFound from './pages/NotFound';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import styles from './App.module.css';

// Automatically scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <div className={styles.appContainer}>
            <div className={styles.bgGradient}></div>
            <Navbar />
            <main className={styles.mainContent}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visualizer" element={<Visualizer />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
