import { validationResult } from 'express-validator';

export async function getProfile(req, res) { res.json({ success: true, data: { user: req.user.toJSON() } }); }
export async function updateProfile(req, res, next) {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({ success: false, message: result.array()[0].msg });
    const allowed = {};
    if (req.body.fullName) allowed.fullName = req.body.fullName.trim();
    if (Object.keys(allowed).length === 0) return res.status(400).json({ success: false, message: 'No valid profile field provided' });
    Object.assign(req.user, allowed);
    await req.user.save();
    res.json({ success: true, message: 'Profile updated', data: { user: req.user.toJSON() } });
  } catch (error) { next(error); }
}
