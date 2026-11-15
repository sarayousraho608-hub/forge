// يبني نصاً عن مهاراتك ومشاريعك من القاعدة ليعرفها المساعد (مخزَّن 60 ثانية)
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Setting from '../models/Setting.js';

const memo = new Map();

export async function getSiteContext(lang) {
  const hit = memo.get(lang);
  if (hit && hit.expires > Date.now()) return hit.text;

  const L = (v) => (typeof v === 'string' ? v : v?.[lang] || v?.en || '');
  const [skills, projects, avail] = await Promise.all([
    Skill.find().sort({ order: 1 }).lean(),
    Project.find().sort({ order: 1 }).lean(),
    Setting.findOne({ key: 'available' }).lean(),
  ]);

  const text = [
    `Availability for new work: ${avail && avail.value === false ? 'currently busy' : 'available'}`,
    'SKILLS (status: good = knows well, learning = learning now, planned = will learn; level 0-100):',
    ...skills.map((s) => `- ${L(s.name)} [${s.group}] status=${s.status}, level=${s.level}`),
    'PROJECTS (status: past/current/future):',
    ...projects.map((p) => `- ${L(p.title)} | status=${p.status}, progress=${p.progress}% | ${L(p.desc)} | tech: ${(p.tags || []).join(', ')}`),
  ].join('\n');

  memo.set(lang, { text, expires: Date.now() + 60 * 1000 });
  return text;
}
