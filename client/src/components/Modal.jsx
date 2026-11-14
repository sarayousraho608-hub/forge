import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

// نافذة منبثقة عامة: تُغلق بزر X أو Esc أو بالضغط خارجها.
export default function Modal({ title, onClose, children, burst = false }) {
  const { t } = useApp();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {burst && (
        <>
          <span className="boom-ring" />
          <span className="boom-ring r2" />
          <span className="boom-ring r3" />
        </>
      )}
      <div className="modal glow-box" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t('close')}><X size={18} /></button>
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
