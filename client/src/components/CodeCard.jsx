import { useEffect, useState } from 'react';
import { PROFILE } from '../config';
import AvailabilityBadge from './AvailabilityBadge';
import { useApp } from '../context/AppContext';
import './codecard.css';

// بطاقة كود تُكتب أمام الزائر، وتحتها النتيجة: الاسم والعمل وهل أنتِ متاحة. الاسم والعمل يتبعان اللغة.
// ✏️ عدّلي النص من translations.js (heroName و codeRole) والتوفر من config.js (available).
const buildLines = (name, role, available) => [
  [['k', 'const '], ['v', 'dev'], ['p', ' = {']],
  [['p', '  '], ['v', 'name'], ['p', ': '], ['s', `'${name}'`], ['p', ',']],
  [['p', '  '], ['v', 'role'], ['p', ': '], ['s', `'${role}'`], ['p', ',']],
  [['p', '  '], ['v', 'available'], ['p', ': '], ['k', String(available)], ['p', ',']],
  [['p', '};']],
  [['f', 'render'], ['p', '('], ['v', 'dev'], ['p', ');']],
];
const lens = (L) => L.map((l) => l.reduce((n, [, s]) => n + s.length, 0));

function lineView(L, LEN, STARTS, i, n) {
  // الجزء المكتوب من السطر i عندما يكون المكتوب كله n حرفاً
  let left = Math.max(0, Math.min(LEN[i], n - STARTS[i]));
  return L[i].map(([c, s], k) => {
    const part = s.slice(0, left);
    left = Math.max(0, left - s.length);
    return part ? <span key={k} className={`cc-${c}`}>{part}</span> : null;
  });
}

export default function CodeCard() {
  const { t, lang } = useApp();
  const name = t('heroName');
  const role = t('codeRole');
  const L = buildLines(name, role, PROFILE.available);
  const LEN = lens(L);
  const STARTS = LEN.map((_, i) => LEN.slice(0, i).reduce((a, b) => a + b, 0));
  const TOTAL = LEN.reduce((a, b) => a + b, 0);
  const [n, setN] = useState(0);
  const [run, setRun] = useState(0); // يزيد عند إعادة التشغيل

  // يُعاد التشغيل عند تغيير اللغة حتى يُكتب الكود بالاسم والعمل الجديدين
  useEffect(() => {
    let i = 0;
    let timer;
    setN(0);
    const tick = () => {
      i += 1;
      setN(i);
      if (i >= TOTAL) return;
      timer = setTimeout(tick, STARTS.includes(i) ? 260 : 26); // توقف قصير عند بداية كل سطر
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, lang]);

  const done = (i) => n >= STARTS[i] + LEN[i];
  const typingLine = L.findIndex((_, i) => n < STARTS[i] + LEN[i]);
  const caretLine = typingLine === -1 ? L.length - 1 : typingLine;
  const last = L.length - 1;

  return (
    <div className="codecard" dir="ltr">
      <div className="cc-bar">
        <i /><i /><i />
        <span>dev.js</span>
      </div>
      <pre className="cc-code" aria-label="code">
        {L.map((_, i) => (
          <div key={i} className="cc-line">
            {lineView(L, LEN, STARTS, i, n)}
            {i === caretLine && <span className="cc-caret" />}
          </div>
        ))}
      </pre>
      <div className={`cc-out${done(last) ? ' live' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="cc-out-title" dir="ltr">{done(last) ? '▶ output' : '…'}</div>
        <div className={`cc-name${done(1) ? ' on' : ''}`}>{name}</div>
        <div className={`cc-role${done(2) ? ' on' : ''}`}>{role}</div>
        <div className={`cc-avail${done(3) ? ' on' : ''}`}><AvailabilityBadge /></div>
      </div>
      <button className="cc-replay" onClick={() => setRun(run + 1)} data-nosound aria-label="replay">↻</button>
    </div>
  );
}
