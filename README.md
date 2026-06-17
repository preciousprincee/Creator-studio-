# ✦ Aria — Your Personal Content Strategist

An AI-powered personal content strategist for TikTok & Instagram Reels creators. Built with React + Vite, Tailwind CSS, and Groq API.

## Features
- 🎨 **Guided onboarding** — Aria collects your profile across 8 friendly steps
- 💾 **Persistent sessions** — your profile & strategy survive page refreshes (localStorage)
- 📈 **Full strategy dashboard** — Brand Voice, Growth Strategy, Content Calendar, Ideas, Tips
- ✍️ **Script generator** — per-idea Hook → Body → CTA scripts
- 🌐 **Live web search** — real-time trends via Tavily API (optional)
- ⚙️ **In-app settings** — paste your API keys, no .env needed

## Stack
- React 18 + Vite
- Tailwind CSS (warm, approachable design system)
- Groq API — llama3-70b-8192
- Tavily API — optional web search

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173, click ⚙️ → paste your Groq key → Test & Save.

Get a free Groq key at https://console.groq.com  
Get a free Tavily key at https://tavily.com (optional, enables live trend search)

## Deploy to Vercel

```bash
# Option A — CLI
npm i -g vercel && vercel

# Option B — Dashboard
# Push to GitHub → vercel.com/new → import repo
# Framework: Vite | Build: npm run build | Output: dist
```

`vercel.json` in the root handles SPA routing automatically.

### Optional env vars (if you prefer not to use in-app settings)
```
VITE_GROQ_API_KEY=gsk_...
VITE_TAVILY_API_KEY=tvly-...
```

## Data & Privacy
All user data (profile, strategy, API keys) is stored in **localStorage only** — never sent to any server other than Groq/Tavily directly from the browser.

## Project Structure
```
src/
├── lib/groq.js              # Groq + Tavily API clients
├── hooks/useCreator.js      # All AI calls + state
├── components/
│   ├── UI.jsx               # Design system components
│   ├── Onboarding.jsx       # 8-step profile collection
│   ├── Dashboard.jsx        # Strategy dashboard (6 tabs)
│   └── Settings.jsx         # API key management
└── App.jsx                  # Session restore + routing
```
