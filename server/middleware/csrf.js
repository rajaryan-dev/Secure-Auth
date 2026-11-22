import crypto from 'crypto';

export function issueCsrf(req, res, next) {
  let token = req.cookies?.csrf_token;
  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', token, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
  }
  res.locals.csrfToken = token;
  next();
}

export function verifyCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const cookie = req.cookies?.csrf_token;
  const header = req.get('x-csrf-token');
  if (!cookie || !header || cookie !== header) return res.status(403).json({ success: false, message: 'Invalid CSRF token' });
  next();
}
