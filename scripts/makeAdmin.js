import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

if (adminEmails.length === 0 || !process.env.MONGODB_URI) {
  console.error('ADMIN_EMAILS and MONGODB_URI are required');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const email of adminEmails) {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`${email}: Account not found. Please register`);
      continue;
    }

    user.role = 'admin';
    await user.save();

    console.log(`${email}: Admin assigned.`);
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
