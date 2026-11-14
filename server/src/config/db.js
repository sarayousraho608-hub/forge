import mongoose from 'mongoose';
import Claim from '../models/Claim.js';
import PrizeCode from '../models/PrizeCode.js';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is missing. Create server/.env from .env.example');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    // ننتظر إنشاء الفهارس (مهم لمنع تكرار البريد)
    await Promise.all([Claim.init(), PrizeCode.init()]);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
