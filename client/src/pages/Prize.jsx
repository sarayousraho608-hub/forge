import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import useSecrets, { SECRET_IDS, markSeen } from '../hooks/useSecrets';
import SectionTitle from '../components/SectionTitle';

const ICONS = { sunglasses: '😎', nothing: '🕳️', ai: '🕵️' };

// كود تجريبي محلي مؤقت — غداً يُستبدل بكود حقيقي من الخادم
function demoCode() {
  try {
    let c = localStorage.getItem('forge_demo_code');
    if (!c) {
      c = 'FORGE-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      localStorage.setItem('forge_demo_code', c);
    }
    return c;
  } catch {
    return 'FORGE-DEMO';
  }
}

export default function Prize() {
  const { t } = useApp();
  const { found, count, total } = useSecrets();
  const [copied, setCopied] = useState(false);
  useEffect(() => { markSeen(); }, [count]); // زيارة الصفحة تُخفي إشعار الأسرار الجديدة
  const done = count === total;
  const code = done ? demoCode() : null;

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); } catch { /* تجاهل */ }
  };

  return (
    <>
      <section id="prize-intro">
        <div className="container">
          <SectionTitle title={t('prizeTitle')} sub={t('prizeSub')} />
          <div className="prize-card glow-box">
            <div className="big">{t('prizeBig')}</div>
            <p>{t('prizeIntro')}</p>
            <p><span className="hl-yellow">{t('prizeLimit')}</span></p>
          </div>
        </div>
      </section>

      <section id="prize-secrets">
        <div className="container">
          <SectionTitle title={t('secretsTitle')} sub={t('secretsSub')} />
          <div className="counter">
            <span className="num">{count}/{total}</span>
            <div className="progress" style={{ flex: 1 }}><span style={{ width: `${(count / total) * 100}%` }} /></div>
          </div>
          <div className="secrets-list">
            {SECRET_IDS.map((id) => {
              const ok = found.includes(id);
              return (
                <div key={id} className={`secret-card glow-box ${ok ? 'found' : 'locked'}`}>
                  <div className="ico">{ok ? ICONS[id] : '❓'}</div>
                  <h3>{ok ? t('secretName_' + id) : t('secretLocked')}</h3>
                  <small>{ok ? t('secretText_' + id) : t('secretHint_' + id)}</small>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="prize-code">
        <div className="container">
          <SectionTitle title={t('codeTitle')} />
          <div className="code-box glow-box">
            {done ? (
              <>
                <p>{t('codeReady')}</p>
                <div className="code">{code}</div>
                <div><button className="btn btn-ghost" onClick={copy}>{copied ? t('codeCopied') : t('codeCopy')}</button></div>
                <p className="note" style={{ marginTop: '0.8rem' }}>{t('codeDemoNote')}</p>
              </>
            ) : (
              <p>🔒 {t('codeLockedText')}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
