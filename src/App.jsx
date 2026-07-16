import { useState, useEffect } from 'react';
import katantraData from './data/katantra-data.yaml';
import Sanscript from '@indic-transliteration/sanscript';
import './App.css';

// Flatten the hierarchical Katantra data to make linear navigation (next/prev) simple
const allSutras = [];
katantraData.forEach((prakarana) => {
  prakarana.padas.forEach((pada) => {
    pada.sutras.forEach((sutra) => {
      allSutras.push({
        prakaranaId: prakarana.prakaranaId,
        prakaranaNameDevanagari: prakarana.prakaranaNameDevanagari,
        padaId: pada.padaId,
        padaNo: pada.padaNo,
        padaNameDevanagari: pada.padaNameDevanagari,
        ...sutra,
      });
    });
  });
});

// Dynamic script transliteration helper
const transliterateIfNeeded = (text, toScript) => {
  if (!text) return '';
  if (toScript === 'iast') {
    return Sanscript.t(text, 'devanagari', 'iast');
  }
  return text;
};

function App() {
  const [activeSutraIndex, setActiveSutraIndex] = useState(0);
  const [script, setScript] = useState('devanagari'); // 'devanagari' | 'iast'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'
  const [activeCommentaryIndex, setActiveCommentaryIndex] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeSutra = allSutras[activeSutraIndex] || allSutras[0];

  // Sync dark/light theme with root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  // Sync active sutra index with browser URL hash (deep linking)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the '#'
      if (hash) {
        const index = allSutras.findIndex((s) => s.sutraNo === hash);
        if (index !== -1) {
          setActiveSutraIndex(index);
        }
      }
    };

    // Run on initial page load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when sutra changes
  useEffect(() => {
    if (activeSutra) {
      const currentHash = window.location.hash.substring(1);
      if (currentHash !== activeSutra.sutraNo) {
        window.location.hash = activeSutra.sutraNo;
      }
    }
    // Reset commentary tab back to first one (Laghuvritti) on sutra switch
    setActiveCommentaryIndex(0);
  }, [activeSutraIndex]);

  // Navigation handlers
  const goToNext = () => {
    if (activeSutraIndex < allSutras.length - 1) {
      setActiveSutraIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (activeSutraIndex > 0) {
      setActiveSutraIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation listener (Left/Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSutraIndex]);

  // Handler for dropdown selections
  const handlePrakaranaChange = (e) => {
    const prakaranaId = e.target.value;
    const firstSutraOfPrakarana = allSutras.find((s) => s.prakaranaId === prakaranaId);
    if (firstSutraOfPrakarana) {
      const index = allSutras.findIndex((s) => s.sutraNo === firstSutraOfPrakarana.sutraNo);
      setActiveSutraIndex(index);
    }
  };

  const handlePadaChange = (e) => {
    const padaId = e.target.value;
    const firstSutraOfPada = allSutras.find((s) => s.padaId === padaId);
    if (firstSutraOfPada) {
      const index = allSutras.findIndex((s) => s.sutraNo === firstSutraOfPada.sutraNo);
      setActiveSutraIndex(index);
    }
  };

  const handleSutraChange = (e) => {
    const sutraNo = e.target.value;
    const index = allSutras.findIndex((s) => s.sutraNo === sutraNo);
    if (index !== -1) {
      setActiveSutraIndex(index);
    }
  };

  // Helper selectors data
  const currentPrakarana = katantraData.find((p) => p.prakaranaId === activeSutra.prakaranaId);
  const currentPada = currentPrakarana.padas.find((p) => p.padaId === activeSutra.padaId);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">कातन्त्रम्</div>
          <div className="header-subtitle">
            {transliterateIfNeeded(activeSutra.prakaranaNameDevanagari, script)}
          </div>
        </div>

        <div className="header-controls">
          {/* Mobile hamburger menu toggle */}
          <button 
            className="btn-toggle btn-menu-toggle btn-icon-only" 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle Navigation Index"
          >
            ☰
          </button>

          {/* Script Toggler */}
          <button 
            className="btn-toggle" 
            onClick={() => setScript(script === 'devanagari' ? 'iast' : 'devanagari')}
          >
            📝 {script === 'devanagari' ? 'देवनागरी' : 'IAST'}
          </button>

          {/* Theme Toggler */}
          <button 
            className="btn-toggle btn-icon-only" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="app-workspace">
        {/* Mobile Backdrop */}
        <div 
          className={`sidebar-backdrop ${mobileSidebarOpen ? 'show' : ''}`}
          onClick={() => setMobileSidebarOpen(false)}
        />

        {/* Sidebar Index */}
        <aside className={`app-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">📖 सूत्र-सूची (Sutra Index)</div>
          </div>
          <div className="sidebar-scroll">
            {katantraData.map((prakarana) => (
              <div key={prakarana.prakaranaId} className="prakarana-group">
                <div className="prakarana-title-node">
                  {transliterateIfNeeded(prakarana.prakaranaNameDevanagari, script)}
                </div>
                {prakarana.padas.map((pada) => (
                  <div key={pada.padaId} className="pada-group">
                    <div className="pada-title-node">
                      {script === 'devanagari' 
                        ? `${pada.padaNameDevanagari} (${pada.padaNo})` 
                        : `${transliterateIfNeeded(pada.padaNameDevanagari, 'iast')} (${pada.padaNo})`}
                    </div>
                    <div className="sutra-list-node">
                      {pada.sutras.map((sutra) => {
                        const globalIndex = allSutras.findIndex((s) => s.sutraNo === sutra.sutraNo);
                        return (
                          <button
                            key={sutra.sutraNo}
                            className={`sutra-item-btn ${activeSutraIndex === globalIndex ? 'active' : ''}`}
                            onClick={() => {
                              setActiveSutraIndex(globalIndex);
                              setMobileSidebarOpen(false); // Close drawer on mobile click
                            }}
                          >
                            {sutra.sutraNo} - {transliterateIfNeeded(sutra.textDevanagari, script)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Reader Container */}
        <section className="app-reader">
          {/* Selector Row */}
          <div className="selectors-row">
            <div className="selector-group">
              <label>प्रकरणम्</label>
              <select 
                className="custom-select" 
                value={activeSutra.prakaranaId} 
                onChange={handlePrakaranaChange}
              >
                {katantraData.map((p) => (
                  <option key={p.prakaranaId} value={p.prakaranaId}>
                    {transliterateIfNeeded(p.prakaranaNameDevanagari, script)}
                  </option>
                ))}
              </select>
            </div>

            <div className="selector-group">
              <label>पादः</label>
              <select 
                className="custom-select" 
                value={activeSutra.padaId} 
                onChange={handlePadaChange}
              >
                {currentPrakarana.padas.map((pada) => (
                  <option key={pada.padaId} value={pada.padaId}>
                    {script === 'devanagari' 
                      ? `${pada.padaNameDevanagari} (${pada.padaNo})` 
                      : `${transliterateIfNeeded(pada.padaNameDevanagari, 'iast')} (${pada.padaNo})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="selector-group">
              <label>सूत्रम्</label>
              <select 
                className="custom-select" 
                value={activeSutra.sutraNo} 
                onChange={handleSutraChange}
              >
                {currentPada.sutras.map((s) => (
                  <option key={s.sutraNo} value={s.sutraNo}>
                    {s.sutraNo} - {transliterateIfNeeded(s.textDevanagari, script)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Sutra Reading Card */}
          <article className="sutra-card">
            <div className="sutra-card-header">
              <div className="prakarana-badge">
                {script === 'devanagari' 
                  ? `${activeSutra.prakaranaNameDevanagari} • ${activeSutra.padaNameDevanagari}` 
                  : `${transliterateIfNeeded(activeSutra.prakaranaNameDevanagari, 'iast')} • ${transliterateIfNeeded(activeSutra.padaNameDevanagari, 'iast')}`}
              </div>
              <div className="sutra-number-badge">सूत्रम् {activeSutra.sutraNo}</div>
            </div>

            <div className="sutra-content-display">
              <div key={activeSutra.sutraNo} className={`sutra-text-main ${script}`}>
                {transliterateIfNeeded(activeSutra.textDevanagari, script)}
              </div>
            </div>
          </article>

          {/* Commentaries Card */}
          <section className="commentary-card">
            <div className="commentary-tabs-header">
              <div className="commentary-tabs">
                {activeSutra.commentaries.map((comm, idx) => (
                  <button
                    key={idx}
                    className={`commentary-tab-btn ${activeCommentaryIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveCommentaryIndex(idx)}
                  >
                    {transliterateIfNeeded(comm.nameDevanagari, script)}
                  </button>
                ))}
              </div>
              {activeSutra.commentaries[activeCommentaryIndex] && (
                <div className="commentary-meta-author">
                  <span>Author:</span>
                  <span className="author-name-highlight">
                    {transliterateIfNeeded(activeSutra.commentaries[activeCommentaryIndex].authorDevanagari, script)}
                  </span>
                </div>
              )}
            </div>

            <div key={`${activeSutra.sutraNo}-${activeCommentaryIndex}`} className="commentary-content-pane">
              {activeSutra.commentaries[activeCommentaryIndex] ? (
                <p className={`commentary-text ${script}`}>
                  {transliterateIfNeeded(activeSutra.commentaries[activeCommentaryIndex].textDevanagari, script)}
                </p>
              ) : (
                <p className="commentary-text" style={{ color: 'var(--text-muted)' }}>
                  No commentary loaded for this sūtra.
                </p>
              )}
            </div>
          </section>

          {/* Navigation Controls Bar */}
          <footer className="navigation-bar">
            <button 
              className="nav-btn" 
              onClick={goToPrevious} 
              disabled={activeSutraIndex === 0}
            >
              ← Previous Sūtra
            </button>

            <div className="keyboard-shortcut-hint">
              <span>Use</span>
              <kbd className="key-kbd">←</kbd>
              <kbd className="key-kbd">→</kbd>
              <span>keys to navigate</span>
            </div>

            <button 
              className="nav-btn" 
              onClick={goToNext} 
              disabled={activeSutraIndex === allSutras.length - 1}
            >
              Next Sūtra →
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
