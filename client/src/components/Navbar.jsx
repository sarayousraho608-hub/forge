import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isMuted, toggleMuted } from '../sound';

// الصفحات وأقسام كل صفحة (يظهر القسم في الشريط الفرعي عندما تكونين في تلك الصفحة)
const PAGES = [
  { path: '/', label: 'navHome', sections: [['about', 'navAbout'], ['skills', 'navSkills'], ['projects', 'navProjects'], ['contact', 'navContact']] },
  { path: '/nothing', label: 'navNothing', sections: [] },
  { path: '/prize', label: 'navPrize', sections: [['prize-intro', 'prizeSecIntro'], ['prize-secrets', 'prizeSecSecrets'], ['prize-code', 'prizeSecCode']] },
];

export default function Navbar() {
  const { t, theme, toggleTheme, toggleLang } = useApp();
  const { pathname } = useLocation();
  const [muted, setMuted] = useState(isMuted());
  const current = PAGES.find((p) => p.path === pathname);

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand">{t('brand')}</Link>
        <nav className="nav-links nav-pages">
          {PAGES.map((p) => (
            <NavLink key={p.path} to={p.path} end className={({ isActive }) => (isActive ? 'active' : '')}>
              {t(p.label)}
            </NavLink>
          ))}
        </nav>
        <div className="nav-tools">
          <button className="icon-btn" onClick={() => setMuted(toggleMuted())}
            title={muted ? t('soundOff') : t('soundOn')} aria-label={muted ? t('soundOff') : t('soundOn')}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="icon-btn" onClick={toggleTheme} title={t('themeToggle')} aria-label={t('themeToggle')}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={toggleLang} title={t('langToggle')} aria-label={t('langToggle')}>
            {t('langButton')}
          </button>
        </div>
      </div>
      {current && current.sections.length > 0 && (
        <div className="subnav">
          <nav className="container">
            {current.sections.map(([id, label]) => (
              <Link key={id} to={{ pathname: current.path, hash: '#' + id }}>{t(label)}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
