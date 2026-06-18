module.exports = async (req, res) => {
  const { endpoint, apikey, ...params } = req.query;
  const key = req.headers['x-api-key'] || apikey;

  if (!endpoint || !key) {
    res.status(400).json({ errors: ['missing endpoint or key'] });
    return;
  }

  const url = new URL('https://v3.football.api-sports.io' + endpoint);
  Object.keys(params).forEach((k) => {
    const v = params[k];
    if (v !== undefined) url.searchParams.set(k, Array.isArray(v) ? v[0] : v);
  });

  try {
    const upstream = await fetch(url.toString(), {
      headers: { 'x-apisports-key': key }
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(502).json({ errors: ['upstream_failed: ' + String(e && e.message || e)] });
  }
};
