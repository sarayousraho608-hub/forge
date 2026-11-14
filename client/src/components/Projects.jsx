import { useState } from 'react';
import { useApp } from '../context/AppContext';
import useFetch from '../hooks/useFetch';
import { dataUrl } from '../api';
import SectionTitle from './SectionTitle';
import Modal from './Modal';

const FILTERS = ['all', 'past', 'current', 'future'];
const FILTER_KEY = { all: 'filterAll', past: 'statusPast', current: 'statusCurrent', future: 'statusFuture' };

export default function Projects() {
  const { t, lang } = useApp();
  const { data, loading, error } = useFetch(dataUrl('projects'));
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const list = data ? data.filter((p) => filter === 'all' || p.status === filter) : [];
  const fmt = (d) => (d
    ? new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-DZ-u-nu-latn' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
    : '—');

  const block = (p, key, title) => {
    const items = p.details?.[key]?.[lang] || [];
    return (
      <>
        <h4>{t(title)}</h4>
        {items.length ? <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul> : <p>{t('emptyList')}</p>}
      </>
    );
  };

  return (
    <section id="projects">
      <div className="container">
        <SectionTitle title={t('projectsTitle')} sub={t('projectsSub')} />
        <div className="filters">
          {FILTERS.map((f) => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {t(FILTER_KEY[f])}
            </button>
          ))}
        </div>
        {loading && <p>{t('loading')}</p>}
        {error && <p>{t('loadError')}</p>}
        {data && list.length === 0 && <p>{t('noProjects')}</p>}
        <div className="projects-grid">
          {list.map((p) => (
            <article
              key={p.id}
              className="project glow-box lift"
              role="button"
              tabIndex={0}
              onClick={() => setOpen(p)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(p); } }}
            >
              <div className="thumb">
                {p.image ? <img src={p.image} alt="" /> : t('projectImageHint')}
              </div>
              <div className="body">
                <span className={`status ${p.status}`}>{t(FILTER_KEY[p.status])}</span>
                <h3>{p.title[lang]}</h3>
                <p>{p.desc[lang]}</p>
                <div className="progress-row">
                  <div className="progress" role="progressbar" aria-label={t('progressLabel')} aria-valuenow={p.progress} aria-valuemin="0" aria-valuemax="100">
                    <span style={{ width: `${p.progress}%` }} />
                  </div>
                  <span>{p.progress}%</span>
                </div>
                <div className="dates">
                  <span>{t('startedLabel')}: {fmt(p.start)}</span>
                  <span>{t('expectedEndLabel')}: {fmt(p.end)}</span>
                </div>
                <div className="tags">{p.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <span className="click-hint">{t('clickHint')}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {open && (
        <Modal title={open.title[lang]} onClose={() => setOpen(null)}>
          <p>{open.desc[lang]}</p>
          <div className="progress-row" style={{ marginBlock: '0.8rem' }}>
            <div className="progress"><span style={{ width: `${open.progress}%` }} /></div>
            <span>{open.progress}%</span>
          </div>
          <div className="dates">
            <span>{t('startedLabel')}: {fmt(open.start)}</span>
            <span>{t('expectedEndLabel')}: {fmt(open.end)}</span>
          </div>
          {block(open, 'done', 'modalDone')}
          {block(open, 'todo', 'modalTodo')}
          {block(open, 'problems', 'modalProblems')}
          {block(open, 'tech', 'modalTech')}
        </Modal>
      )}
    </section>
  );
}
