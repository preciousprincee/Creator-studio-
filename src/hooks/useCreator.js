import { useState } from 'react'
import { groqChat, safeParseJSON, webSearch } from '../lib/groq'

const SYS = `You are Aria, a warm expert content strategist for TikTok and Instagram Reels.
Give specific, actionable advice tailored to each creator. When web data is provided, use it.
CRITICAL: Always reply with ONLY raw valid JSON — no markdown fences, no explanation, no text outside JSON.`

const STORAGE_KEY = 'aria_user_data'

export function loadSaved() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null } catch { return null }
}
export function clearSaved() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}
function saveData(profile, strategy) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, strategy, savedAt: Date.now() })) } catch {}
}

export function useCreator() {
  const [profile,   setProfile]   = useState(null)
  const [strategy,  setStrategy]  = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [webUsed,   setWebUsed]   = useState(false)
  // Per-idea script state: { [ideaTitle]: { loading, data } }
  const [scripts,   setScripts]   = useState({})
  // New ideas loading state
  const [loadingNewIdeas, setLoadingNewIdeas] = useState(false)

  function restoreSession(saved) {
    setProfile(saved.profile)
    setStrategy(saved.strategy)
    setWebUsed(false)
  }

  async function generateStrategy(profileData) {
    setLoading(true)
    setError(null)
    setStrategy(null)
    setWebUsed(false)
    setScripts({})
    setProfile(profileData)
    try {
      // Tavily searches run in parallel for real-time grounding
      const [s1, s2, s3] = await Promise.all([
        webSearch(`${profileData.niche} TikTok content strategy growth 2025`),
        webSearch(`viral ${profileData.niche} Instagram Reels trending ideas 2025`),
        webSearch(`best posting times TikTok Reels ${profileData.niche} engagement 2025`),
      ])
      const webCtx = [s1,s2,s3].filter(Boolean).join('\n\n---\n\n')
      setWebUsed(!!webCtx)

      const p = profileData
      const prompt = `Build a complete personal content strategy for this creator.

CREATOR PROFILE:
- Name: ${p.name}
- Niche: ${p.niche}
- Platforms: ${p.platforms.join(', ')}
- Followers: ${p.followers}
- Posting frequency: ${p.postingFreq}
- Biggest struggle: ${p.struggle}
- Main goal: ${p.goal}
- Content style: ${p.style}
${webCtx ? `\nLIVE WEB DATA (prioritise this for current trends):\n${webCtx}` : ''}

Return ONLY this JSON object (no other text):
{
  "greeting": "Warm 2-sentence personalised welcome from Aria acknowledging their specific situation and niche",
  "brandVoice": {
    "tone": ["descriptor 1","descriptor 2","descriptor 3"],
    "pillars": [
      {"name":"Pillar name","description":"One sentence what this covers","emoji":"emoji"},
      {"name":"...","description":"...","emoji":"..."},
      {"name":"...","description":"...","emoji":"..."}
    ],
    "avoid": ["thing to avoid 1","thing to avoid 2"],
    "uniqueAngle": "One sentence: what makes this creator stand out in their niche"
  },
  "growthStrategy": {
    "summary": "2-sentence growth approach for their level and goal",
    "tactics": [
      {"title":"Tactic","description":"Specific actionable detail","priority":"High","timeframe":"Week 1-2"},
      {"title":"...","description":"...","priority":"Medium","timeframe":"..."},
      {"title":"...","description":"...","priority":"High","timeframe":"..."},
      {"title":"...","description":"...","priority":"Medium","timeframe":"..."}
    ],
    "postingSchedule": {
      "frequency": "Recommended posts/week with reasoning",
      "bestTimes": ["Platform: Day Time — reason","Platform: Day Time — reason"],
      "consistency": "One consistency tip for their level"
    }
  },
  "calendar": [
    {"day":"Monday","theme":"Theme","idea":"Specific post idea","format":"Face to Camera|Text on Screen + Music|Voiceover + B-roll|Tutorial|POV / Skit|Trend","hook":"Opening hook","caption":"Caption tip"},
    {"day":"Tuesday","theme":"...","idea":"...","format":"...","hook":"...","caption":"..."},
    {"day":"Wednesday","theme":"...","idea":"...","format":"...","hook":"...","caption":"..."},
    {"day":"Thursday","theme":"...","idea":"...","format":"...","hook":"...","caption":"..."},
    {"day":"Friday","theme":"...","idea":"...","format":"...","hook":"...","caption":"..."},
    {"day":"Saturday","theme":"...","idea":"...","format":"...","hook":"...","caption":"..."},
    {"day":"Sunday","theme":"Rest & Engage","idea":"Reply to comments, research trends, plan next week","format":"optional","hook":"","caption":"Engagement tip"}
  ],
  "contentIdeas": [
    {"title":"Idea title","hook":"Hook line","format":"format","why":"Why this works for them specifically","potential":"High|Very High|Explosive","emoji":"emoji"},
    {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
    {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
    {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
    {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
    {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."}
  ],
  "performanceTips": {
    "quickWins": ["Action 1 for this week","Action 2 for this week","Action 3 for this week"],
    "metrics": ["Metric 1 and why to track it","Metric 2 and why","Metric 3 and why"],
    "levelUpTip": "Advice specific to their follower count to reach next level",
    "struggleFix": "Direct advice for their struggle: ${p.struggle}"
  }
}`
      const raw = await groqChat(prompt, SYS, 2200)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Strategy could not be parsed. Please try again.')
      setStrategy(parsed)
      saveData(profileData, parsed)
    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate a full detailed script for an idea
  async function generateScript(idea) {
    setScripts(s => ({ ...s, [idea.title]: { loading: true, data: null } }))
    try {
      const webCtx = await webSearch(`"${idea.format}" script TikTok hook examples ${profile?.niche} 2025`)
      const prompt = `Write a detailed short-form video script.

Creator niche: ${profile?.niche}
Creator style: ${profile?.style}
Followers: ${profile?.followers}
Idea: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}
${webCtx ? `\nWeb context:\n${webCtx}` : ''}

Write a FULL, word-for-word script. Be specific, punchy, platform-native.

Return ONLY this JSON:
{
  "hook": "Exact opening words/text for first 3 seconds — make it scroll-stopping",
  "body": [
    "Full sentence/line for point 1 — exactly what to say or show",
    "Full sentence/line for point 2 — exactly what to say or show",
    "Full sentence/line for point 3 — exactly what to say or show"
  ],
  "cta": "Exact call-to-action words to say at the end",
  "duration": "Estimated duration e.g. 28–35s",
  "tip": "One specific delivery, pacing or editing tip for this format"
}`
      const raw = await groqChat(prompt, SYS, 900)
      const data = safeParseJSON(raw)
      setScripts(s => ({ ...s, [idea.title]: { loading: false, data } }))
    } catch {
      setScripts(s => ({ ...s, [idea.title]: { loading: false, data: null, error: true } }))
    }
  }

  // Generate 6 fresh ideas without regenerating the full strategy
  async function generateNewIdeas() {
    setLoadingNewIdeas(true)
    try {
      const [s1, s2] = await Promise.all([
        webSearch(`trending ${profile?.niche} TikTok content ideas viral 2025`),
        webSearch(`${profile?.niche} Instagram Reels hooks formats performing well 2025`),
      ])
      const webCtx = [s1,s2].filter(Boolean).join('\n\n---\n\n')

      const p = profile
      const prompt = `Generate 6 FRESH viral content ideas for this creator. Make them different from generic ideas — specific and creative.

Creator: ${p?.name}, Niche: ${p?.niche}, Style: ${p?.style}, Goal: ${p?.goal}, Followers: ${p?.followers}
${webCtx ? `\nLIVE TREND DATA:\n${webCtx}` : ''}

Return ONLY a JSON array of exactly 6 objects:
[
  {"title":"Idea title","hook":"Opening hook line","format":"Face to Camera|Text on Screen + Music|Voiceover + B-roll|Tutorial|POV / Skit|Trend","why":"Why this works for this specific creator","potential":"High|Very High|Explosive","emoji":"emoji"},
  {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
  {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
  {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
  {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."},
  {"title":"...","hook":"...","format":"...","why":"...","potential":"...","emoji":"..."}
]`
      const raw = await groqChat(prompt, SYS, 1200)
      const newIdeas = safeParseJSON(raw)
      if (newIdeas && Array.isArray(newIdeas)) {
        const updated = { ...strategy, contentIdeas: newIdeas }
        setStrategy(updated)
        saveData(profile, updated)
        // Clear old scripts for new ideas
        setScripts({})
      }
    } catch(e) {
      console.error('generateNewIdeas failed:', e)
    } finally {
      setLoadingNewIdeas(false)
    }
  }

  function reset() {
    setProfile(null); setStrategy(null); setError(null)
    setWebUsed(false); setScripts({}); setLoadingNewIdeas(false)
  }

  return {
    profile, strategy, loading, error, webUsed,
    scripts, loadingNewIdeas,
    setError, restoreSession, reset,
    generateStrategy, generateScript, generateNewIdeas,
  }
}
