import { useApp } from '../context/AppContext';
import { PROFILE } from '../config';

export default function Footer() {
  const { t } = useApp();
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`mailto:${PROFILE.email}`}>Email</a>
        </div>
        <span>{t('footerText')} <span className="hl-red">♥</span></span>
      </div>
    </footer>
  );
}
