import { Link } from 'react-router-dom';
import { Sun, Moon, Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { theme, toggleTheme, toggleLang, t } = useApp();

  return (
    <header style={{ borderBottom: '1px solid var(--border)', paddingBlock: '1rem' }}>
      <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}>
          {t('brand')}
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: '600' }}>
            {t('navHome')}
          </Link>
          <Link to="/nothing" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
            {t('navNothing')}
          </Link>

          <button
            onClick={toggleTheme}
            aria-label={t('themeToggle')}
            className="glow-box"
            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', color: theme === 'light' ? 'var(--accent-yellow)' : 'var(--primary-light)' }}
          >
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={toggleLang}
            aria-label={t('langToggle')}
            className="glow-box"
            style={{ padding: '0.5rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ink)', fontWeight: '600' }}
          >
            <Languages size={18} color="var(--accent-red)" />
            <span>{t('langButton')}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}