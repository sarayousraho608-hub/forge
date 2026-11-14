import { useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { unlockSecret } from '../hooks/useSecrets';

// صفحة فارغة إلا من عنوان صغير. اضغطي في أي مكان 5 ثوانٍ فيُكشف السر.
export default function NothingPage() {
  const { t } = useApp();
  const timer = useRef(null);

  const start = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => unlockSecret('nothing'), 5000);
  };
  const stop = () => clearTimeout(timer.current);

  useEffect(() => stop, []);

  return (
    <div
      className="nothing"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      <h1>{t('nothingTitle')}</h1>
    </div>
  );
}
