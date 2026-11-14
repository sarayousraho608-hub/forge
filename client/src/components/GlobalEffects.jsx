import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { playHover, playClick } from '../sound';
import { unlockSecret } from '../hooks/useSecrets';

const SELECTOR = 'button:not([data-nosound]), .btn, .nav-links a, .subnav a, .project';

// أصوات المرور والنقر على كل الأزرار + السر الأول (التحويل من الليلي إلى الساطع)
export default function GlobalEffects() {
  const { theme } = useApp();
  const prevTheme = useRef(theme);

  useEffect(() => {
    if (prevTheme.current === 'dark' && theme === 'light') unlockSecret('sunglasses');
    prevTheme.current = theme;
  }, [theme]);

  useEffect(() => {
    const over = (e) => {
      const el = e.target.closest?.(SELECTOR);
      const from = e.relatedTarget?.closest?.(SELECTOR);
      if (el && el !== from) playHover();
    };
    const click = (e) => { if (e.target.closest?.(SELECTOR)) playClick(); };
    document.addEventListener('pointerover', over);
    document.addEventListener('click', click);
    return () => {
      document.removeEventListener('pointerover', over);
      document.removeEventListener('click', click);
    };
  }, []);
  return null;
}
