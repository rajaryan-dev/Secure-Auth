import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { createToken, hashToken, signSession } from '../utils/tokens.js';
import { sendEmail } from '../services/email.js';

const validate = (req, res) => { const result = validationResult(req); if (!result.isEmpty()) { res.status(400).json({ success: false, message: result.array()[0].msg }); return false; } return true; };
const cookieOptions = (remember = false) => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 });

export async function register(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const { fullName, email, password, terms } = req.body;
    if (!terms) return res.status(400).json({ success: false, message: 'You must accept the terms' });
    const normalizedEmail = email.toLowerCase().trim();
    const verificationToken = createToken();
    const user = await User.create({ fullName, email: normalizedEmail, password, emailVerificationTokenHash: hashToken(verificationToken), emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    const link = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(normalizedEmail, 'Verify your SecureAuth email', 'Verify your email', `<p>Welcome to SecureAuth, ${fullName}. Verify your email to secure your account.</p><p><a href="${link}" style="display:inline-block;background:#000;color:#fff;padding:12px 18px;text-decoration:none;border-radius:8px">Verify email</a></p>`);
    res.status(201).json({ success: true, message: 'Account created. Check your email to verify your address.', data: { user: user.toJSON() } });
  } catch (error) { next(error); }
}

export async function login(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    res.cookie('auth_token', signSession(user._id, Boolean(req.body.remember)), cookieOptions(Boolean(req.body.remember)));
    res.json({ success: true, message: 'Login successful', data: { user: user.toJSON() } });
  } catch (error) { next(error); }
}

export async function logout(req, res) { res.clearCookie('auth_token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }); res.json({ success: true, message: 'Logged out successfully' }); }
export async function me(req, res) { res.json({ success: true, data: { user: req.user.toJSON() } }); }

export async function forgotPassword(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() }).select('+passwordResetTokenHash +passwordResetExpires');
    if (user) {
      const token = createToken();
      user.passwordResetTokenHash = hashToken(token);
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
      await sendEmail(user.email, 'Reset your SecureAuth password', 'Reset your password', `<p>This link expires in 1 hour.</p><p><a href="${link}" style="display:inline-block;background:#000;color:#fff;padding:12px 18px;text-decoration:none;border-radius:8px">Reset password</a></p>`);
    }
    res.json({ success: true, message: 'If an account exists for that email, a reset link has been sent.' });
  } catch (error) { next(error); }
}

export async function resetPassword(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const hash = hashToken(req.body.token);
    const user = await User.findOne({ passwordResetTokenHash: hash, passwordResetExpires: { $gt: new Date() } }).select('+passwordResetTokenHash +passwordResetExpires');
    if (!user) return res.status(400).json({ success: false, message: 'Reset token is invalid or expired' });
    user.password = req.body.password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    await sendEmail(user.email, 'Your SecureAuth password changed', 'Password changed', '<p>Your password was changed successfully. If this was not you, contact support immediately.</p>');
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) { next(error); }
}

export async function verifyEmail(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const hash = hashToken(req.body.token);
    const user = await User.findOne({ emailVerificationTokenHash: hash, emailVerificationExpires: { $gt: new Date() } }).select('+emailVerificationTokenHash +emailVerificationExpires');
    if (!user) return res.status(400).json({ success: false, message: 'Verification token is invalid or expired' });
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) { next(error); }
}

export async function resendVerification(req, res, next) {
  try {
    if (req.user.isEmailVerified) return res.status(400).json({ success: false, message: 'Email is already verified' });
    const token = createToken();
    req.user.emailVerificationTokenHash = hashToken(token);
    req.user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await req.user.save();
    const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    await sendEmail(req.user.email, 'Verify your SecureAuth email', 'Verify your email', `<p><a href="${link}" style="display:inline-block;background:#000;color:#fff;padding:12px 18px;text-decoration:none;border-radius:8px">Verify email</a></p>`);
    res.json({ success: true, message: 'Verification email sent' });
  } catch (error) { next(error); }
}

export async function changePassword(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = req.body.password;
    await user.save();
    await sendEmail(user.email, 'Your SecureAuth password changed', 'Password changed', '<p>Your password was changed successfully.</p>');
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
}
