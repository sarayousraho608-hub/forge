import { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const bubbleStyle = (role) => ({
  alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
  background: role === 'user' ? 'var(--primary)' : 'var(--border)',
  color: role === 'user' ? '#fff' : 'var(--ink)',
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '0.85rem',
  maxWidth: '85%',
});

export default function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { t } = useApp();

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    // رد تجريبي محلي (Mock AI) يعمل بدون إنترنت. سيُستبدل لاحقاً بطلب إلى الخادم
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: t('mockReply') }]);
    }, 600);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', insetInlineStart: '24px', zIndex: 1000 }}>
      {/* الشخصية في طرف الشاشة (إيموجي مؤقتاً) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="glow-box"
          aria-label={t('chatOpen')}
          title={t('chatOpenTitle')}
          style={{
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '50%',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--primary)',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '24px' }}>😎</span>
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              insetInlineEnd: '-5px',
              background: 'var(--accent-red)',
              borderRadius: '50%',
              width: '12px',
              height: '12px',
            }}
          />
        </button>
      )}

      {/* نافذة الشات */}
      {isOpen && (
        <div
          className="glow-box"
          style={{
            width: '320px',
            maxWidth: 'calc(100vw - 48px)',
            height: '400px',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--primary)',
          }}
        >
          {/* رأس الشات */}
          <div
            style={{
              background: 'var(--primary)',
              color: '#fff',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} />
              <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>😎 {t('chatTitle')}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label={t('chatClose')}
              style={{ background: 'transparent', color: '#fff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* الرسائل */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={bubbleStyle('assistant')}>{t('chatGreeting')}</div>
            {messages.map((m, idx) => (
              <div key={idx} style={bubbleStyle(m.role)}>
                {m.content}
              </div>
            ))}
          </div>

          {/* صندوق الإدخال */}
          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid var(--border)', padding: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatPlaceholder')}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--ink)',
                padding: '6px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              aria-label={t('chatSend')}
              style={{ background: 'var(--primary)', color: '#fff', padding: '6px 12px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}