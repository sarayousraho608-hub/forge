import { useEffect } from 'react';
import { playHover, playClick } from '../sound';

const SELECTOR = 'button:not([data-nosound]), .btn, .nav-links a, .subnav a, .project';

// أصوات المرور والنقر على كل الأزرار + رسالة السر الثالث في الـ Console
export default function GlobalEffects() {
  useEffect(() => {
    const over = (e) => {
      const el = e.target.closest?.(SELECTOR);
      const from = e.relatedTarget?.closest?.(SELECTOR);
      if (el && el !== from) playHover();
    };
    const click = (e) => { if (e.target.closest?.(SELECTOR)) playClick(); };
    document.addEventListener('pointerover', over);
    document.addEventListener('click', click);

    console.log(
      '%c🕵️ مرحباً أيها الفضولي! Hello, curious one!',
      'font-size:18px;font-weight:bold;color:#7c3aed',
    );
    console.log('%cاكتب / type:  unlockSecret3()', 'font-size:14px;color:#e5383b');

    return () => {
      document.removeEventListener('pointerover', over);
      document.removeEventListener('click', click);
    };
  }, []);
  return null;
}
