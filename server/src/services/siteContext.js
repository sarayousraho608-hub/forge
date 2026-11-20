// يبني نصاً عن مهاراتك ومشاريعك من القاعدة ليعرفها المساعد (مخزَّن 60 ثانية)
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Setting from '../models/Setting.js';
import { readFileSync } from 'node:fs';

// نبذة عنكِ يعرفها المساعد: عدّلي الملف server/src/bio.txt (سطر لكل معلومة، بالإنجليزية أو العربية)
function readBio() {
  try {
    return readFileSync(new URL('../bio.txt', import.meta.url), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  } catch {
    return [];
  }
}

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

  const bio = readBio();
  const text = [
    ...(bio.length ? ['ABOUT THE OWNER (you may share these facts):', ...bio.map((l) => `- ${l}`)] : []),
    `Availability for new work: ${avail && avail.value === false ? 'currently busy' : 'available'}`,
    'SKILLS (status: good = knows well, learning = learning now, planned = will learn; level 0-100):',
    ...skills.map((s) => `- ${L(s.name)} [${s.group}] status=${s.status}, level=${s.level}`),
    'PROJECTS (status: past/current/future):',
    ...projects.map((p) => `- ${L(p.title)} | status=${p.status}, progress=${p.progress}% | ${L(p.desc)} | tech: ${(p.tags || []).join(', ')}`),
  ].join('\n');

  memo.set(lang, { text, expires: Date.now() + 60 * 1000 });
  return text;
}
