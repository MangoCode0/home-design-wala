# Home Design Wala frontend

## Run it
1. Install Node.js (version 18 or newer).
2. In this folder run: `npm install`
3. Then run: `npm run dev`
4. Open the address shown in the terminal (usually `http://localhost:5173`).

The shared API client reads `VITE_API_URL`; the checked-in local configuration points to
`https://api.homedesignwala.com`. Public project, category, service, and contact data comes from
the API. The admin area requires server-issued authentication and does not contain credentials.

Projects must use publicly accessible image URLs because the backend does not implement uploads.
The site does not display sample projects or testimonials when the database is empty.

## Folders
- `src/components/` — public website sections
- `src/hooks/` — shared API and reveal hooks
- `public/images/` — visual assets used by the site
- `src/index.css` — brand colors, fonts, and shared button styles
