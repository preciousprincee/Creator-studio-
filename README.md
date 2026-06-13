# 🎬 Creator Studio

AI-powered content strategy tool for TikTok & Instagram Reels creators.

## Stack
- **React + Vite** — fast dev and build
- **Tailwind CSS** — utility-first styling
- **Groq API** (llama3-70b-8192) — ultra-fast AI inference

## Features
- 🧠 Quiz path — answer 3 questions, get tailored ideas
- 💡 Describe path — know your niche, need fresh ideas
- 🤖 AI-suggested best content format per idea (with reasoning)
- 🔥 Content research — trends, hooks, sounds, posting tips, competitor angles
- ✍️ Script generator — Hook → Body → CTA format
- ⚙️ In-app settings — paste your Groq key, no `.env` needed

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173, go to Settings (⚙️ top right) and paste your Groq API key.

Get a free Groq key at https://console.groq.com

---

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B — Vercel Dashboard
1. Push this project to GitHub
2. Go to https://vercel.com/new
3. Import the repo
4. Framework: **Vite**
5. Build command: `npm run build`
6. Output dir: `dist`
7. Click **Deploy**

> The `vercel.json` in the root handles SPA routing automatically.

### Optional: Set API key as env variable
If you want the key baked in (not recommended for public deploys):
1. In Vercel dashboard → Settings → Environment Variables
2. Add `VITE_GROQ_API_KEY` = your key

Otherwise users paste their own key in the Settings screen.

---

## Project Structure

```
src/
├── lib/
│   └── groq.js          # Groq API client + JSON parser
├── hooks/
│   └── useCreator.js    # Central state + all AI calls
├── components/
│   ├── UI.jsx           # Shared: Spinner, Tag, ErrorBanner, etc.
│   ├── Home.jsx         # Landing / path selector
│   ├── Quiz.jsx         # Quiz flow (niche → audience → goal)
│   ├── Describe.jsx     # Description flow (niche + context)
│   ├── Ideas.jsx        # Idea cards + format suggestions
│   ├── Research.jsx     # Research panel + script generator
│   └── Settings.jsx     # API key management
├── App.jsx              # Root + screen navigation
├── main.jsx
└── index.css            # Tailwind + base styles
```
