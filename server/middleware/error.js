export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Resource not found' });
}

export function errorHandler(err, req, res, next) {
  if (err?.code === 11000) return res.status(409).json({ success: false, message: 'An account with that email already exists' });
  if (err?.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
  const status = err.status || 500;
  return res.status(status).json({ success: false, message: status === 500 ? 'An unexpected server error occurred' : err.message });
}
