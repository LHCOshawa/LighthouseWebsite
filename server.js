/* ============================================================
   LIGHTHOUSE CHURCH — BACKEND SERVER  v3
   Credentials loaded from GOOGLE_CREDENTIALS_B64 env var.
   No service-account.json file needed on the server.
   ============================================================ */

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const { google } = require('googleapis');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── CORS ─────────────────────────────────────────────────── */
app.use(cors({
  origin: [
    'https://lhcoshawa.ca',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    /\.lhcoshawa\.ca$/,
  ],
  methods: ['GET'],
}));

/* ── STATIC FILES ─────────────────────────────────────────── */
app.use(express.static(path.join(__dirname)));

/* ── CALENDAR CONFIG ──────────────────────────────────────── */
const CALENDAR_ID = process.env.CALENDAR_ID ||
  '9104549d30365e435d95dcef73e34981c01eb3638d988038d40ca0fd4284cb57@group.calendar.google.com';

/* ── GOOGLE AUTH (from base64 env var — no JSON file needed) ─ */
function getAuthClient() {
  const b64 = process.env.GOOGLE_CREDENTIALS_B64;
  if (!b64) {
    // Local dev fallback: try service-account.json if present
    const keyFile = path.join(__dirname, 'service-account.json');
    return new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
  }

  // Decode base64 → JSON credentials object
  const credentials = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
}

/* ── EVENTS CACHE ─────────────────────────────────────────── */
let eventsCache    = null;
let cacheTimestamp = 0;
const CACHE_TTL    = 5 * 60 * 1000; // 5 minutes

/* ── /api/events ──────────────────────────────────────────── */
app.get('/api/events', async (req, res) => {
  try {
    const now = Date.now();
    if (eventsCache && now - cacheTimestamp < CACHE_TTL) {
      return res.json({ success: true, events: eventsCache, cached: true });
    }

    const auth     = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });
    const maxResults = parseInt(req.query.max) || 5;

    const response = await calendar.events.list({
      calendarId:   CALENDAR_ID,
      timeMin:      new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy:      'startTime',
    });

    const items  = response.data.items || [];
    const events = items.map(item => {
      const startRaw  = item.start?.dateTime || item.start?.date || '';
      const endRaw    = item.end?.dateTime   || item.end?.date   || '';
      const allDay    = !item.start?.dateTime;
      const startDate = new Date(startRaw);
      const hh = startDate.getHours(), mm = startDate.getMinutes();
      const ampm = hh >= 12 ? 'PM' : 'AM', h12 = hh % 12 || 12;
      const timeStr = allDay ? 'All Day' : `${h12}:${String(mm).padStart(2,'0')} ${ampm}`;

      const desc     = item.description || '';
      const imgRe    = /<img[^>]+src=["']([^"']+)["']/i;
      const urlRe    = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp)/i;
      const imgMatch = desc.match(imgRe) || desc.match(urlRe);
      const image    = imgMatch ? (imgMatch[1] || imgMatch[0]) : null;

      const descPlain = desc.replace(/<[^>]+>/g,' ').replace(/\s{2,}/g,' ').trim().slice(0,200);

      return {
        id:          item.id,
        title:       item.summary  || 'Untitled Event',
        description: descPlain,
        image,
        location:    item.location || '',
        startISO:    startRaw,
        endISO:      endRaw,
        allDay,
        time:        timeStr,
        year:        startDate.getFullYear(),
        month:       startDate.getMonth(),
        day:         startDate.getDate(),
        weekday:     startDate.getDay(),
      };
    });

    eventsCache    = events;
    cacheTimestamp = now;
    return res.json({ success: true, events, cached: false });

  } catch (err) {
    console.error('[/api/events] Error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch calendar events' });
  }
});

/* ── HEALTH CHECK ─────────────────────────────────────────── */
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* ── CATCH-ALL → index.html ───────────────────────────────── */
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

/* ── START ────────────────────────────────────────────────── */
app.listen(PORT, () => {
  const cred = process.env.GOOGLE_CREDENTIALS_B64 ? 'env (B64)' : 'service-account.json';
  console.log(`\n✦ Lighthouse Church server → http://localhost:${PORT}`);
  console.log(`  Credentials : ${cred}`);
  console.log(`  Events API  : http://localhost:${PORT}/api/events\n`);
});
