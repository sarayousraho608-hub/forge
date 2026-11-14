import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { unlockSecret } from '../hooks/useSecrets';
import { playSend, playReply } from '../sound';

export default function SmartAssistant() {
  const { t, theme } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const timers = useRef([]);

  // ينزل تلقائياً لآخر رسالة
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toggle = () => {
    // السر الأول: فتح المساعد (ذو النظارة) أثناء المظهر الساطع
    if (!open && theme === 'light') unlockSecret('sunglasses');
    setOpen(!open);
  };

  const send = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    playSend();
    setMessages((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTyping(true);
    // غداً: هنا نستدعي الخادم (POST /api/chat) بدل الرد التجريبي
    timers.current.push(setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: 'bot', text: t('mockReply') }]);
      playReply();
    }, 700));
  };

  const fab = {
    position: 'fixed', insetInlineEnd: '1.2rem', bottom: '1.2rem', zIndex: 80,
    width: 60, height: 60, borderRadius: '50%', fontSize: '1.9rem',
    background: 'var(--surface)', border: '3px solid var(--primary)',
    boxShadow: '5px 5px 0 var(--accent-yellow)',
  };
  const win = {
    position: 'fixed', insetInlineEnd: '1.2rem', bottom: '5.5rem', zIndex: 80,
    width: 'min(340px, 90vw)', height: 'min(460px, 70vh)', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', color: 'var(--ink)',
  };
  const head = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.7rem 1rem', background: 'var(--grad)', color: '#fff', fontWeight: 700,
  };
  const bubble = (mine) => ({
    alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '85%',
    padding: '0.45rem 0.8rem', borderRadius: 14, fontSize: '0.95rem',
    background: mine ? 'var(--primary)' : 'var(--bg-2)',
    color: mine ? '#fff' : 'var(--ink)',
    border: '1px solid var(--border)',
  });

  return (
    <>
      <button style={fab} className="lift" onClick={toggle}
        title={t('chatOpenTitle')} aria-label={t('chatOpenTitle')}>
        {t('chatOpen')}
      </button>

      {open && (
        <div className="glow-box" style={win} role="dialog" aria-label={t('chatTitle')}>
          <div style={head}>
            <span>{t('chatTitle')}</span>
            <button onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 700 }}>
              {t('chatClose')}
            </button>
          </div>

          <div ref={listRef} className="chat-msgs"
            style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: 0 }}>
            <div className="chat-bubble" style={bubble(false)}>{t('chatGreeting')}</div>
            {messages.map((m, i) => (
              <div key={i} className="chat-bubble" style={bubble(m.from === 'me')}>{m.text}</div>
            ))}
            {typing && <div className="chat-bubble" style={bubble(false)}>…</div>}
          </div>

          <form onSubmit={send} style={{ display: 'flex', gap: '0.4rem', padding: '0.6rem', borderTop: '1px solid var(--border)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              style={{ flex: 1, font: 'inherit', color: 'var(--ink)', background: 'var(--bg)', border: '2px solid var(--border)', borderRadius: 12, padding: '0.4rem 0.7rem', minWidth: 0 }}
            />
            <button data-nosound className="btn btn-primary" type="submit" style={{ padding: '0.4rem 1rem' }}>
              {t('chatSend')}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
