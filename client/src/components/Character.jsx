import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import './character.css';

const BASE = '/character/';
const FRAMES = [1, 2, 3, 4, 5, 6, 7].map((n) => `${BASE}t${n}.png`); // من الليل (1) إلى النهار (7)
const LAST = FRAMES.length - 1;
const FRAME_MS = 140;
// ملاحظة: لا نحترم prefers-reduced-motion هنا عمداً؛ حركة الشخصية قصيرة وهي جزء من الفكرة
const REDUCED = false;

// الشخصية: جسم يتنفس (CSS) + وجه يرمش (ليلاً) أو بنظارة (نهاراً).
// عند تبديل المظهر تُعرض إطارات الانتقال بالترتيب (أو بالعكس) ثم تعود الحالة الساكنة.
export default function Character() {
  const { theme } = useApp();
  const [idleTheme, setIdleTheme] = useState(theme); // المظهر الذي تمثّله الحالة الساكنة
  const [frame, setFrame] = useState(null); // null = ساكنة، رقم = إطار انتقال
  const [blink, setBlink] = useState(false);
  const idleRef = useRef(theme);
  const frameRef = useRef(null);

  const show = (v) => { frameRef.current = v; setFrame(v); };

  // الانتقال بين الليل والنهار
  useEffect(() => {
    if (frameRef.current === null && theme === idleRef.current) return undefined;
    if (REDUCED) {
      idleRef.current = theme;
      setIdleTheme(theme);
      show(null);
      return undefined;
    }
    const toDay = theme === 'light';
    const end = toDay ? LAST : 0;
    const dir = toDay ? 1 : -1;
    let pos = frameRef.current ?? (toDay ? 0 : LAST); // نكمل من الإطار الحالي إن كان في منتصف حركة
    let timer;
    const step = () => {
      show(pos);
      if (pos === end) {
        timer = setTimeout(() => {
          idleRef.current = theme;
          setIdleTheme(theme);
          show(null);
        }, FRAME_MS * 1.5);
        return;
      }
      pos += dir;
      timer = setTimeout(step, FRAME_MS);
    };
    step();
    return () => clearTimeout(timer);
  }, [theme]);

  // رمشة عشوائية كل 2.5–5 ثوانٍ (في الليل فقط، والنظارة لا ترمش)
  useEffect(() => {
    if (frame !== null || idleTheme !== 'dark' || REDUCED) return undefined;
    let t1;
    let t2;
    const loop = () => {
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => { setBlink(false); loop(); }, 150);
      }, 2500 + Math.random() * 2500);
    };
    loop();
    return () => { clearTimeout(t1); clearTimeout(t2); setBlink(false); };
  }, [frame, idleTheme]);

  const night = idleTheme === 'dark';
  return (
    <div className="char" aria-hidden="true">
      <div className={`char-idle${frame === null ? '' : ' off'}`}>
        <img src={`${BASE}body.png`} className="on" alt="" draggable="false" />
        <img src={`${BASE}face-open.png`} className={night && !blink ? 'on' : ''} alt="" draggable="false" />
        <img src={`${BASE}face-blink.png`} className={night && blink ? 'on' : ''} alt="" draggable="false" />
        <img src={`${BASE}face-glasses.png`} className={night ? '' : 'on'} alt="" draggable="false" />
      </div>
      {FRAMES.map((src, i) => (
        <img key={src} src={src} className={frame === i ? 'on' : ''} alt="" draggable="false" />
      ))}
    </div>
  );
}

// الشخصية ثابتة (بلا حركة) حسب المظهر الحالي: تُستعمل في قسم "من أنا"
export function StaticCharacter() {
  const { theme } = useApp();
  return (
    <div className="char" aria-hidden="true">
      <img src={`${BASE}body.png`} className="on" alt="" draggable="false" />
      <img src={`${BASE}${theme === 'dark' ? 'face-open' : 'face-glasses'}.png`} className="on" alt="" draggable="false" />
    </div>
  );
}

// وجهها فقط (دائرة صغيرة) لأعلى نافذة المحادثة
export function CharacterFace() {
  const { theme } = useApp();
  return (
    <span className="char-face" aria-hidden="true">
      <span className="char-face-in">
        <img src={`${BASE}body.png`} alt="" draggable="false" />
        <img src={`${BASE}${theme === 'dark' ? 'face-open' : 'face-glasses'}.png`} alt="" draggable="false" />
      </span>
    </span>
  );
}
