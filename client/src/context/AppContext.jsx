import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../translations';

const AppContext = createContext(null);

// قراءة قيمة محفوظة بأمان
function readSaved(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => readSaved('theme', 'dark'));
  const [lang, setLang] = useState(() => readSaved('lang', 'ar'));

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('lang', lang);
    } catch {
      /* التخزين غير متاح */
    }
  }, [theme, lang]);

  const toggleTheme = () => setTheme((x) => (x === 'light' ? 'dark' : 'light'));
  const toggleLang = () => setLang((x) => (x === 'ar' ? 'en' : 'ar'));
  const t = (key) => translations[lang][key] ?? key;

  return (
    <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}