import 'dotenv/config';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

const PORT = process.env.PORT || 5000;

await connectDB();
createApp().listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
