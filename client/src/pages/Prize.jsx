import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import useSecrets, { SECRET_IDS, markSeen } from '../hooks/useSecrets';
import useFetch from '../hooks/useFetch';
import { USE_API, apiUrl, postJson } from '../api';
import SectionTitle from '../components/SectionTitle';

const ICONS = { sunglasses: '😎', nothing: '🕳️', ai: '🕵️' };
const CODE_KEY = 'forge_claim_code';

function readSavedCode() {
  try { return localStorage.getItem(CODE_KEY); } catch { return null; }
}

// كود تجريبي محلي (وضع المشروع 1 بلا خادم)
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
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [savedCode, setSavedCode] = useState(readSavedCode);
  const { data: stats } = useFetch(USE_API ? apiUrl('/api/claims/status') : null);

  useEffect(() => { markSeen(); }, [count]); // زيارة الصفحة تُخفي إشعار الأسرار الجديدة
  const done = count === total;
  const code = !done ? null : USE_API ? savedCode : demoCode();

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); } catch { /* تجاهل */ }
  };

  const claim = async (e) => {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await postJson('/api/claims', { email, secrets: found });
      const data = res.data || { status: 'error', reason: 'network' };
      if (data.status === 'accepted') {
        try { localStorage.setItem(CODE_KEY, data.code); } catch { /* تجاهل */ }
        setSavedCode(data.code);
      } else {
        setResult(data);
      }
    } catch {
      setResult({ status: 'error', reason: 'network' });
    }
    setBusy(false);
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
            {stats && <p className="note">{t('claimRemaining')}: {stats.remaining} / {stats.limit}</p>}
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
            {!done && <p>🔒 {t('codeLockedText')}</p>}

            {done && code && (
              <>
                <p>{t('codeReady')}</p>
                <div className="code">{code}</div>
                <div><button className="btn btn-ghost" onClick={copy}>{copied ? t('codeCopied') : t('codeCopy')}</button></div>
                <p className="note" style={{ marginTop: '0.8rem' }}>{USE_API ? t('claimKeepNote') : t('codeDemoNote')}</p>
              </>
            )}

            {done && !code && USE_API && (
              <form onSubmit={claim}>
                <div className="field">
                  <label htmlFor="claim-email">{t('claimEmailLabel')}</label>
                  <input id="claim-email" type="email" dir="ltr" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t('claimSending') : t('claimSubmit')}</button>
                {result && <p className="err-msg" style={{ marginTop: '0.8rem', color: 'var(--accent-red)', fontWeight: 700 }}>{t('claimReason_' + result.reason)}</p>}
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
