import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROFILE } from '../config';
import SectionTitle from './SectionTitle';

export default function About() {
  const { t } = useApp();
  const [noPhoto, setNoPhoto] = useState(false);
  return (
    <section id="about">
      <div className="container">
        <SectionTitle title={t('aboutTitle')} sub={t('aboutSub')} />
        <div className="about-grid">
          <div className="photo-slot">
            {noPhoto
              ? <span style={{ whiteSpace: 'pre-line' }}>{t('aboutPhotoHint')}</span>
              : <img src={PROFILE.aboutPhoto} alt="" onError={() => setNoPhoto(true)} />}
          </div>
          <div className="about-text glow-box">
            <p>{t('aboutP1')}</p>
            <p>{t('aboutP2')}</p>
            <div className="stats">
              <div className="stat"><b>4</b>{t('stat1')}</div>
              <div className="stat"><b>8</b>{t('stat2')}</div>
              <div className="stat"><b>1</b>{t('stat3')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
