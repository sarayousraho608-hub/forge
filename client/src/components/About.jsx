import { useApp } from '../context/AppContext';
import useFetch from '../hooks/useFetch';
import { dataUrl } from '../api';
import SectionTitle from './SectionTitle';
import CodeCard from './CodeCard';

const YEARS_LEARNING = 5; // ✏️ عدّلي الرقم: منذ كم سنة تتعلمين البرمجة؟

export default function About() {
  const { t } = useApp();
  // الأرقام تُحسب من بيانات المشاريع والمهارات (بلا المشاريع القادمة والمهارات المخطط لها)
  const { data: projects } = useFetch(dataUrl('projects'));
  const { data: skills } = useFetch(dataUrl('skills'));
  const nProjects = projects ? projects.filter((p) => p.status !== 'future').length : '—';
  const nSkills = skills ? skills.filter((x) => x.status !== 'planned').length : '—';
  return (
    <section id="about">
      <div className="container">
        <SectionTitle title={t('aboutTitle')} sub={t('aboutSub')} />
        <div className="about-grid">
          <div className="about-card"><CodeCard /></div>
          <div className="about-text glow-box">
            <p>{t('aboutP1')}</p>
            <p>{t('aboutP2')}</p>
            <div className="stats">
              <div className="stat"><b>{nProjects}</b>{t('stat1')}</div>
              <div className="stat"><b>{nSkills}</b>{t('stat2')}</div>
              <div className="stat"><b>{YEARS_LEARNING}</b>{t('stat3')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
