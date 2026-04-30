# Lighthouse Church Website

## Quick Start

```bash
cp .env.example .env   # fill in your credentials
npm install
npm start              # http://localhost:3000
```

## Credential Setup (Google Calendar)

Credentials are stored as a **base64 env var** — no JSON files committed to Git.

**Step 1 — Generate the base64 string:**
```bash
# macOS / Linux
base64 -i service-account.json | tr -d '\n'

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json"))
```

**Step 2 — Paste into `.env`:**
```env
GOOGLE_CREDENTIALS_B64=eyJ0eXBlIjoic2Vydm...
```

**Step 3 — On Railway / Render / Heroku:**  
Add `GOOGLE_CREDENTIALS_B64` as an environment variable in the dashboard — no file upload needed.

## Pages
| File | URL |
|------|-----|
| `index.html` | `/` — Home |
| `about.html` | `/about.html` |
| `womens-ministry.html` | `/womens-ministry.html` |
| `mens-ministry.html` | `/mens-ministry.html` |
| `childrens-ministry.html` | `/childrens-ministry.html` |
| `fellowship.html` | `/fellowship.html` |
| `giving.html` | `/giving.html` |

## Assets
- `styles.css` — all styles (merged, no separate mobile CSS)
- `main.js` — all JavaScript (shared across all pages)
- `sitemap.xml` — SEO sitemap
- `robots.txt` — crawler rules

## Environment Variables
See `.env.example` for all required variables.
