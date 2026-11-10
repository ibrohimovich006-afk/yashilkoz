// POST /api/diagnose  { image: <base64 JPEG/PNG/WebP>, mime?, crop?, note? }
// Sends the photo to Google Gemini and returns the normalized diagnosis JSON.
import { buildPrompt, normalize, parseJson } from '../lib/core.js';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const MAX_B64 = 3_500_000; // about 2.5 MB of image data

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'config' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'bad_request' });

  const image = typeof body.image === 'string' ? body.image.replace(/^data:image\/[\w+.-]+;base64,/, '') : '';
  if (!image) return res.status(400).json({ error: 'no_image' });
  if (image.length > MAX_B64) return res.status(413).json({ error: 'too_large' });
  const mime = /^image\/(jpeg|png|webp)$/.test(body.mime) ? body.mime : 'image/jpeg';
  const crop = typeof body.crop === 'string' ? body.crop.slice(0, 40) : '';
  const note = typeof body.note === 'string' ? body.note.slice(0, 500) : '';

  const payload = {
    contents: [{ role: 'user', parts: [{ text: buildPrompt(crop, note) }, { inlineData: { mimeType: mime, data: image } }] }],
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
  };

  let upstream;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(55_000)
      }
    );
  } catch (e) {
    console.error('Gemini request failed:', e && e.message);
    return res.status(502).json({ error: 'upstream' });
  }

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '');
    console.error('Gemini error', upstream.status, text.slice(0, 600));
    if (upstream.status === 429) return res.status(429).json({ error: 'rate_limited' });
    if (/api key|permission|PERMISSION_DENIED|UNAUTHENTICATED/i.test(text) || upstream.status === 401 || upstream.status === 403) {
      return res.status(500).json({ error: 'config' });
    }
    if (upstream.status === 400) return res.status(400).json({ error: 'image_rejected' });
    return res.status(502).json({ error: 'upstream' });
  }

  const data = await upstream.json().catch(() => null);
  const cand = data && Array.isArray(data.candidates) ? data.candidates[0] : null;
  if (!cand) {
    const blocked = data && data.promptFeedback && data.promptFeedback.blockReason;
    return res.status(422).json({ error: blocked ? 'refused' : 'empty' });
  }
  const text = ((cand.content && cand.content.parts) || []).map((p) => (p && p.text) || '').join('');
  const parsed = parseJson(text);
  if (!parsed) {
    console.error('Unparseable Gemini reply:', text.slice(0, 400));
    return res.status(502).json({ error: 'invalid_json' });
  }
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(normalize(parsed));
}
