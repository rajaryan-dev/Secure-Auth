import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
export const createToken = () => crypto.randomBytes(32).toString('hex');
export const signSession = (userId, remember = false) => jwt.sign({ sub: String(userId) }, process.env.JWT_SECRET, { expiresIn: remember ? '30d' : '1d' });
