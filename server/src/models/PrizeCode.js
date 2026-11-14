import mongoose from 'mongoose';

// مخزن الأكواد الجاهزة (100 كود). كل كود يُعطى لشخص واحد فقط.
export default mongoose.model('PrizeCode', new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  claimedBy: { type: String, default: null },
  claimedAt: { type: Date, default: null },
}));
