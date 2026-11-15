import mongoose from 'mongoose';

// دليل أن زائراً (visitorId) كشف سرّاً معيّناً. السر ai لا يُسجَّل إلا من خلال المساعد في الخادم.
const schema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  secret: { type: String, enum: ['sunglasses', 'nothing', 'ai'], required: true },
}, { timestamps: true });
schema.index({ visitorId: 1, secret: 1 }, { unique: true });

export default mongoose.model('SecretProof', schema);
