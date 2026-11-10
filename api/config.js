// GET /api/config — public settings for the browser.
// The Supabase anon/publishable key is designed to be public; row level security protects the data.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({
    // Accept the URL with or without a trailing /rest/v1/ copied from the dashboard.
    supabaseUrl: (process.env.SUPABASE_URL || '').trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, ''),
    supabaseKey: process.env.SUPABASE_ANON_KEY || ''
  });
}
