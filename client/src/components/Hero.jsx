import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import AvailabilityBadge from './AvailabilityBadge';

export default function Hero() {
  const { t } = useApp();
  return (
    <section id="home" className="hero">
      <div className="container">
        <div>
          <AvailabilityBadge />
          <h1>
            {t('heroHello')} <span className="name">{t('heroName')}</span>
            <br />
            <span className="hl-yellow">{t('heroRole')}</span>
          </h1>
          <p>{t('heroText')}</p>
          <div className="actions">
            <Link to="/#projects" className="btn btn-primary">{t('heroCta1')}</Link>
            <Link to="/#contact" className="btn btn-ghost">{t('heroCta2')}</Link>
          </div>
        </div>
        <div className="avatar-wrap"><Avatar /></div>
      </div>
    </section>
  );
}
