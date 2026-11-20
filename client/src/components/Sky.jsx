import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import './sky.css';

// دائرة "من أنا": سماء متحركة (نجوم تلمع، قمر، شهاب، غيوم) وقطة سوداء تراقبها.
// ✏️ لاستعمال صورة قطتك: ضعي ملفاً شفافاً باسم cat.png داخل client/public (تظهر بدل الرسمة المرسومة بالكود).
function CatSvg() {
  return (
    <svg className="sky-cat-svg" viewBox="0 0 100 120" aria-hidden="true">
      <g fill="#05060f" stroke="rgba(170,185,255,0.35)" strokeWidth="0.8" strokeLinejoin="round">
        <path className="cat-tail" d="M68 116 C94 118 98 94 86 84" fill="none" strokeWidth="7" strokeLinecap="round" stroke="#05060f" />
        <path d="M28 119 C20 94 28 68 41 62 L59 62 C72 68 80 94 72 119 Z" />
        <circle cx="50" cy="48" r="17" />
        <path d="M35 40 L37 21 L49 33 Z" />
        <path d="M65 40 L63 21 L51 33 Z" />
      </g>
    </svg>
  );
}

export default function Sky() {
  const { theme } = useApp();
  const [noCat, setNoCat] = useState(false);
  const stars = useMemo(() => {
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    return Array.from({ length: 38 }, () => ({
      x: rnd() * 100, y: rnd() * 62, s: 1 + rnd() * 2, d: rnd() * 4, o: 2.2 + rnd() * 2.5,
    }));
  }, []);
  const night = theme === 'dark';

  return (
    <div className={`sky ${night ? 'night' : 'day'}`} role="img" aria-label="">
      {night && stars.map((s, i) => (
        <i key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, '--d': `${s.d}s`, '--o': `${s.o}s` }} />
      ))}
      {night && <i className="shoot" />}
      <i className="moon" />
      <i className="cloud c1" /><i className="cloud c2" /><i className="cloud c3" />
      <div className="hill" />
      <div className="sky-cat">
        {noCat
          ? <CatSvg />
          : <img src="/cat.png" alt="" onError={() => setNoCat(true)} draggable="false" />}
      </div>
    </div>
  );
}
