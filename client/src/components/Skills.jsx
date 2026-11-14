import { useApp } from '../context/AppContext';
import useFetch from '../hooks/useFetch';
import { dataUrl } from '../api';
import SectionTitle from './SectionTitle';

const GROUPS = [['good', 'skillsGood'], ['learning', 'skillsLearning'], ['planned', 'skillsPlanned']];
const label = (v, lang) => (typeof v === 'string' ? v : v[lang]);

export default function Skills() {
  const { t, lang } = useApp();
  const { data, loading, error } = useFetch(dataUrl('skills'));
  return (
    <section id="skills">
      <div className="container">
        <SectionTitle title={t('skillsTitle')} sub={t('skillsSub')} />
        {loading && <p>{t('loading')}</p>}
        {error && <p>{t('loadError')}</p>}
        {data && GROUPS.map(([key, title]) => {
          const items = data.filter((s) => s.status === key);
          if (items.length === 0) return null;
          return (
            <div key={key} className="skill-group">
              <h3 className={`group-title ${key}`}>{t(title)}</h3>
              <div className="skills-grid">
                {items.map((s) => (
                  <div key={s.id} className="skill glow-box lift">
                    <h3><span>{label(s.name, lang)}</span><span className="group">{s.group}</span></h3>
                    <div className="meter-row">
                      <div className="meter" role="progressbar" aria-label={t('levelLabel')} aria-valuenow={s.level} aria-valuemin="0" aria-valuemax="100">
                        <span style={{ width: `${s.level}%` }} />
                      </div>
                      <b>{s.level}%</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
