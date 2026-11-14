import mongoose from 'mongoose';

const bi = { ar: { type: String, default: '' }, en: { type: String, default: '' } };

const schema = new mongoose.Schema({
  title: bi,
  desc: bi,
  status: { type: String, enum: ['past', 'current', 'future'], required: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  start: Date,
  end: Date,
  tags: [String],
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  details: mongoose.Schema.Types.Mixed, // { done, todo, problems, tech } كل واحد { ar:[], en:[] }
  order: { type: Number, default: 0 },
}, { toJSON: { versionKey: false, transform(_d, ret) { ret.id = ret._id; delete ret._id; } } });

export default mongoose.model('Project', schema);
