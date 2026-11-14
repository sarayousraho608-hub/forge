import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.Mixed, required: true }, // نص أو { ar, en }
  group: { type: String, default: '' },
  status: { type: String, enum: ['good', 'learning', 'planned'], required: true },
  level: { type: Number, min: 0, max: 100, default: 0 },
  order: { type: Number, default: 0 },
}, { toJSON: { versionKey: false, transform(_d, ret) { ret.id = ret._id; delete ret._id; } } });

export default mongoose.model('Skill', schema);
