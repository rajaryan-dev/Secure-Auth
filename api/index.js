import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createApp } from '../server/server.js';

let connected = null;

export default async function handler(req, res) {
  if (process.env.MONGODB_URI && mongoose.connection.readyState !== 1) {
    if (!connected) connected = mongoose.connect(process.env.MONGODB_URI).catch(() => {
      connected = null;
    });
    await connected;
  }
  return createApp()(req, res);
}
