/* ============================================================
   LIGHTHOUSE CHURCH — BACKEND SERVER  v4 (hardened)
   Credentials loaded from GOOGLE_CREDENTIALS_B64 env var.
   No service-account.json file needed on the server.
   ============================================================ */

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const { google }   = require('googleapis');

const app  = express();
const PORT = process.env.PORT || 3000;

/* If deployed behind a reverse proxy / load balancer (Render, Heroku,
   nginx, Cloudflare, etc.) this makes rate-limiting and req.ip see the
   real client IP instead of the proxy's. Safe to leave on even when
   there's no proxy — Express just falls back to the socket address. */
app.set('trust proxy', 1);

/* Prevent Express from advertising itself in response headers. */
app.disable('x-powered-by');

/* ── SECURITY HEADERS ─────────────────────────────────────── */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", 'https://www.youtube.com', 'https://s.ytimg.com', 'https://www.gstatic.com'],
      styleSrc:   ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:     ["'self'", 'data:', 'https://lh3.googleusercontent.com', 'https://i.ytimg.com', 'https://yt3.ggpht.com'],
      frameSrc:   ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://drive.google.com', 'https://calendar.google.com', 'https://www.google.com'],
      connectSrc: ["'self'", 'https://www.googleapis.com', 'https://calendar.google.com', 'https://corsproxy.io', 'https://api.allorigins.win', 'https://www.youtube.com', 'https://s.ytimg.com'],
      objectSrc:  ["'none'"],
      baseUri:    ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // needed to allow the YouTube/Drive iframes
}));

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

/* ── RATE LIMITING ────────────────────────────────────────── */
// General limiter for everything (protects the whole site from floods).
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));
// Tighter limiter on the calendar API — each uncached hit costs a real
// Google Calendar API call, so this is also a cost/quota protection.
const eventsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests — please try again shortly.' },
});

/* ── STATIC FILES ─────────────────────────────────────────── */
// Never let the source/config files sitting in this same folder be
// downloaded — only the actual site assets should ever be served.
const BLOCKED_FILES = new Set([
  'server.js', 'package.json', 'package-lock.json', '.env',
  '.env.local', 'service-account.json', 'README.md', '.gitignore',
]);
app.use((req, res, next) => {
  const reqPath = decodeURIComponent(req.path).replace(/^\/+/, '');
  if (BLOCKED_FILES.has(reqPath) || reqPath.startsWith('.git') || reqPath.startsWith('node_modules')) {
    return res.status(404).end();
  }
  next();
});
app.use(express.static(path.join(__dirname), {
  dotfiles: 'deny',
  index: 'index.html',
}));

/* ── CALENDAR CONFIG ──────────────────────────────────────── */
const CALENDAR_ID = process.env.CALENDAR_ID ||
  '9104549d30365e435d95dcef73e34981c01eb3638d988038d40ca0fd4284cb57@group.calendar.google.com';

/* ── GOOGLE AUTH (from base64 env var — no JSON file needed) ─ */
let cachedAuthClient = null;
function getAuthClient() {
  if (cachedAuthClient) return cachedAuthClient; // reuse — avoids re-parsing credentials on every request

  const b64 = process.env.GOOGLE_CREDENTIALS_B64;
  if (!b64) {
    // Local dev fallback: try service-account.json if present
    const keyFile = path.join(__dirname, 'service-account.json');
    cachedAuthClient = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
    return cachedAuthClient;
  }

  // Decode base64 → JSON credentials object
  let credentials;
  try {
    credentials = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  } catch (e) {
    throw new Error('GOOGLE_CREDENTIALS_B64 is not valid base64-encoded JSON');
  }
  cachedAuthClient = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
  return cachedAuthClient;
}

/* ── EVENTS CACHE ─────────────────────────────────────────── */
let eventsCache    = null;
let cacheTimestamp = 0;
const CACHE_TTL    = 5 * 60 * 1000; // 5 minutes

/* ── /api/events ──────────────────────────────────────────── */
app.get('/api/events', eventsLimiter, async (req, res) => {
  try {
    const now = Date.now();
    if (eventsCache && now - cacheTimestamp < CACHE_TTL) {
      return res.json({ success: true, events: eventsCache, cached: true });
    }

    const auth     = getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });
    // Clamp to a sane range so this can't be abused to request huge payloads.
    const maxResults = Math.min(Math.max(parseInt(req.query.max, 10) || 5, 1), 25);

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
    // Log full detail server-side only — never leak internals to the client.
    console.error('[/api/events] Error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch calendar events' });
  }
});

/* ── HEALTH CHECK ─────────────────────────────────────────── */
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* ── CATCH-ALL → index.html (only for GET, no query/body reflected) ── */
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

/* ── START ────────────────────────────────────────────────── */
app.listen(PORT, () => {
  const cred = process.env.GOOGLE_CREDENTIALS_B64 ? 'env (B64)' : 'service-account.json';
  console.log(`\n✦ Lighthouse Church server → http://localhost:${PORT}`);
  console.log(`  Credentials : ${cred}`);
  console.log(`  Events API  : http://localhost:${PORT}/api/events\n`);
});
