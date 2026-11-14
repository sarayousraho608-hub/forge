// يملأ القاعدة من ملفات JSON التي في الواجهة + يجهّز أكواد الجائزة.
// التشغيل (من مجلد server):  node src/scripts/seed.js
import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { randomInt } from 'node:crypto';
import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Setting from '../models/Setting.js';
import PrizeCode from '../models/PrizeCode.js';

const dataDir = new URL('../../../client/public/data/', import.meta.url);
const readJson = async (name) => JSON.parse(await readFile(new URL(name, dataDir), 'utf8'));
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // بدون أحرف متشابهة (0/O و1/I)
const makeCode = () => 'FORGE-' + Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');

if (!process.env.MONGO_URI) { console.error('❌ MONGO_URI missing in server/.env'); process.exit(1); }
await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

const skills = (await readJson('skills.json')).map(({ id, ...s }, i) => ({ ...s, order: i }));
const projects = (await readJson('projects.json')).map(({ id, ...p }, i) => ({ ...p, order: i }));

await Skill.deleteMany({});
await Project.deleteMany({});
await Skill.insertMany(skills);
await Project.insertMany(projects);
await Setting.findOneAndUpdate({ key: 'available' }, { value: true }, { upsert: true });
console.log(`✅ ${skills.length} skills, ${projects.length} projects`);

// أكواد الجائزة: نكمّل حتى العدد المطلوب (لا نمسّ الأكواد الموجودة)
const limit = Number(process.env.PRIZE_LIMIT) || 100;
let have = await PrizeCode.countDocuments();
while (have < limit) {
  try { await PrizeCode.create({ code: makeCode() }); have += 1; } catch (e) { if (e.code !== 11000) throw e; }
}
console.log(`✅ ${have} prize codes ready`);

await mongoose.disconnect();
