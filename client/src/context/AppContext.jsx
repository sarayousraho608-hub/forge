import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const AppContext = createContext();

// قراءة قيمة محفوظة بأمان (قد يفشل localStorage في بعض الحالات)
function readSaved(key, allowed, fallback) {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => readSaved('theme', ['light', 'dark'], 'dark'));
  const [lang, setLang] = useState(() => readSaved('lang', ['ar', 'en'], 'ar'));

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleLang = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));

  // دالة الترجمة: t('heroTitle')
  const t = (key) => translations[lang][key] ?? key;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('lang', lang);
    } catch {
      // نتجاهل الخطأ: الموقع يعمل بدون حفظ
    }
  }, [theme, lang]);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);