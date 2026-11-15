// كاش بسيط في الذاكرة مع مدة صلاحية. يضيف الترويسة X-Cache: HIT أو MISS
const store = new Map();

export function cache(seconds) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const hit = store.get(key);
    if (hit && hit.expires > Date.now()) {
      res.set('X-Cache', 'HIT');
      return res.status(200).json(hit.body);
    }
    res.set('X-Cache', 'MISS');
    const send = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200) store.set(key, { body, expires: Date.now() + seconds * 1000 });
      return send(body);
    };
    next();
  };
}

// مسح الكاش (كله أو ما يبدأ بمسار معيّن)
export function clearCache(prefix = '') {
  for (const key of store.keys()) if (key.startsWith(prefix)) store.delete(key);
}
