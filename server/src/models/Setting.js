import mongoose from 'mongoose';

// إعدادات بسيطة (مفتاح/قيمة). مثال: available = true
export default mongoose.model('Setting', new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
}));
