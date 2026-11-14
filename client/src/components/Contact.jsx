import { useState } from 'react';
import { useApp } from '../context/AppContext';
import SectionTitle from './SectionTitle';

export default function Contact() {
  const { t } = useApp();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = t('errName');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = t('errEmail');
    if (form.message.trim().length < 10) err.message = t('errMessage');
    setErrors(err);
    if (Object.keys(err).length === 0) {
      // غداً: هنا نرسل الرسالة إلى الخادم (POST /api/messages)
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } else {
      setSent(false);
    }
  };

  return (
    <section id="contact">
      <div className="container">
        <SectionTitle title={t('contactTitle')} sub={t('contactSub')} />
        <form className="contact-card glow-box" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="name">{t('formName')}</label>
            <input id="name" name="name" value={form.name} onChange={change} />
            {errors.name && <span className="err">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email">{t('formEmail')}</label>
            <input id="email" name="email" type="email" dir="ltr" value={form.email} onChange={change} />
            {errors.email && <span className="err">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="message">{t('formMessage')}</label>
            <textarea id="message" name="message" rows="5" value={form.message} onChange={change} />
            {errors.message && <span className="err">{errors.message}</span>}
          </div>
          <button className="btn btn-primary" type="submit">{t('formSend')}</button>
          {sent && <p className="ok-msg">{t('formOk')}</p>}
        </form>
      </div>
    </section>
  );
}
