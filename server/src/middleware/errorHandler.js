export function notFound(_req, res) {
  res.status(404).json({ error: 'not_found' });
}

// Express 5 يمرّر أخطاء الدوال async إلى هنا تلقائياً
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') return res.status(400).json({ error: 'validation', message: err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'bad_json' });
  console.error(err);
  res.status(500).json({ error: 'server_error' });
}
