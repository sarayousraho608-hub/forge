import { useApp } from '../context/AppContext';
import { PROFILE } from '../config';

export default function Footer() {
  const { t } = useApp();
  return (
    <footer className="footer">
      <div className="container">
        <strong className="footer-name">{PROFILE.fullName}</strong>
        <div className="row">
          <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={`mailto:${PROFILE.email}`} dir="ltr">{PROFILE.email}</a>
        </div>
        <span>{t('footerText')} <span className="hl-red">♥</span></span>
      </div>
    </footer>
  );
}
