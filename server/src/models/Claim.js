import mongoose from 'mongoose';

// سجلّ كل طلب كود: مقبول أو مرفوض (لا نحذف شيئاً)
const schema = new mongoose.Schema({
  email: { type: String, required: true },
  emailKey: { type: String, required: true }, // البريد بعد التوحيد (يمنع a.b+x@gmail.com)
  status: { type: String, enum: ['accepted', 'rejected'], required: true },
  reason: { type: String, default: '' },
  code: { type: String, default: null },
  ip: String,
  userAgent: String,
}, { timestamps: true });

// طلب مقبول واحد فقط لكل بريد (مضمون من قاعدة البيانات نفسها)
schema.index({ emailKey: 1 }, { unique: true, partialFilterExpression: { status: 'accepted' } });

export default mongoose.model('Claim', schema);
