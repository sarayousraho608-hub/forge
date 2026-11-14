import mongoose from 'mongoose';

export default mongoose.model('Message', new mongoose.Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true, maxlength: 120 },
  message: { type: String, required: true, maxlength: 2000 },
  ip: String,
}, { timestamps: true }));
