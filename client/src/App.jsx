import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import SmartAssistant from './components/SmartAssistant';
import { Sparkles, Code, Terminal, CheckCircle2 } from 'lucide-react';

// الصفحة الرئيسية
function Home() {
  const { t } = useApp();
  return (
    <div className="container" style={{ paddingBlock: '3rem' }}>
      <section className="glow-box" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          {t('heroTitle')}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '700px', marginInline: 'auto', marginBottom: '1.5rem' }}>
          {t('heroText')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="glow-box" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <Code size={18} color="var(--primary)" /> React + Vite
          </span>
          <span className="glow-box" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <Terminal size={18} color="var(--accent-yellow)" /> Node.js &amp; MongoDB
          </span>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="glow-box lift" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
            <Sparkles size={20} /> {t('skill1Title')}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{t('skill1Text')}</p>
        </div>
        <div className="glow-box lift" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent-red)' }}>
            <CheckCircle2 size={20} /> {t('skill2Title')}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{t('skill2Text')}</p>
        </div>
      </section>
    </div>
  );
}

// صفحة "لا شيء" (السر 2): فارغة، والنص يظهر بعد ضغط مطوّل 5 ثوانٍ
function NothingPage() {
  const { t } = useApp();
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef(null);

  const startHold = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setRevealed(true);
      try {
        localStorage.setItem('secret2', 'found');
      } catch {
        // نتجاهل الخطأ
      }
    }, 5000);
  };

  const cancelHold = () => clearTimeout(timerRef.current);

  // تنظيف المؤقت عند مغادرة الصفحة
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {revealed && (
        <p style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', padding: '1rem' }}>
          {t('secret2Found')}
        </p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nothing" element={<NothingPage />} />
            </Routes>
          </main>
          <SmartAssistant />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}