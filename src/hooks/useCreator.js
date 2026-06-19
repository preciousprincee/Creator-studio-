import { useState } from 'react'
import { groqChat, safeParseJSON, webSearch } from '../lib/groq'

const SYS = `You are Aria, a warm expert content strategist for TikTok and Instagram Reels.
You give specific, actionable, creative advice tailored to each creator's exact niche and style.
When web search data is provided, use real names, real trends, and real examples from it.
CRITICAL RULE: Always reply with ONLY raw valid JSON — absolutely no markdown fences, no prose, no text outside the JSON structure.`

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
  const [profile,         setProfile]         = useState(null)
  const [strategy,        setStrategy]        = useState(null)
  const [competitors,     setCompetitors]     = useState(null)
  const [loading,         setLoading]         = useState(false)
  const [loadingCompetitors, setLoadingCompetitors] = useState(false)
  const [loadingNewIdeas, setLoadingNewIdeas] = useState(false)
  const [error,           setError]           = useState(null)
  const [webUsed,         setWebUsed]         = useState(false)
  const [scripts,         setScripts]         = useState({})

  function restoreSession(saved) {
    setProfile(saved.profile)
    setStrategy(saved.strategy)
    if (saved.competitors) setCompetitors(saved.competitors)
    setWebUsed(false)
  }

  async function generateStrategy(profileData) {
    setLoading(true); setError(null); setStrategy(null)
    setWebUsed(false); setScripts({}); setCompetitors(null)
    setProfile(profileData)
    try {
      const [s1,s2,s3] = await Promise.all([
        webSearch(`${profileData.niche} TikTok Instagram content strategy what works 2025`),
        webSearch(`viral ${profileData.niche} short form video ideas hooks trending 2025`),
        webSearch(`${profileData.niche} creators TikTok best posting time engagement tips 2025`),
      ])
      const webCtx = [s1,s2,s3].filter(Boolean).join('\n\n---\n\n')
      setWebUsed(!!webCtx)
      const p = profileData
      const prompt = `Build a complete personalised content strategy for this creator.

CREATOR PROFILE:
- Name: ${p.name}
- Niche: ${p.niche}
- Platforms: ${p.platforms.join(', ')}
- Followers: ${p.followers}
- Posting frequency: ${p.postingFreq}
- Biggest struggle: ${p.struggle}
- Main goal: ${p.goal}
- Content style: ${p.style}
${webCtx ? `\nLIVE WEB DATA (use this for real current trends):\n${webCtx}` : ''}

Return ONLY valid JSON with this exact structure:
{
  "greeting": "2-sentence warm welcome from Aria that references their specific niche and situation",
  "brandVoice": {
    "tone": ["descriptor 1","descriptor 2","descriptor 3"],
    "pillars": [
      {"name":"Pillar name","description":"What content goes here and why it works","emoji":"emoji"},
      {"name":"...","description":"...","emoji":"..."},
      {"name":"...","description":"...","emoji":"..."}
    ],
    "avoid": ["specific thing to avoid 1","specific thing to avoid 2"],
    "uniqueAngle": "One sharp sentence: their specific differentiator in this niche"
  },
  "growthStrategy": {
    "summary": "2 sentences on the exact growth approach for their level and goal",
    "tactics": [
      {"title":"Tactic name","description":"Specific actionable step with detail","priority":"High","timeframe":"Week 1"},
      {"title":"...","description":"...","priority":"High","timeframe":"Week 1-2"},
      {"title":"...","description":"...","priority":"Medium","timeframe":"Week 2-3"},
      {"title":"...","description":"...","priority":"Medium","timeframe":"Month 1"}
    ],
    "postingSchedule": {
      "frequency": "X posts per week — specific reasoning for their level",
      "bestTimes": ["TikTok: Tuesday & Thursday 7–9 PM — reason","Instagram: Monday & Friday 6–8 PM — reason"],
      "consistency": "Specific consistency tip for someone at their follower level"
    }
  },
  "calendar": [
    {"day":"Monday","theme":"Theme name","idea":"Very specific post idea with detail","format":"Face to Camera","hook":"Exact hook line to open with","caption":"Specific caption tip with example"},
    {"day":"Tuesday","theme":"...","idea":"...","format":"Text on Screen + Music","hook":"...","caption":"..."},
    {"day":"Wednesday","theme":"...","idea":"...","format":"Tutorial","hook":"...","caption":"..."},
    {"day":"Thursday","theme":"...","idea":"...","format":"Face to Camera","hook":"...","caption":"..."},
    {"day":"Friday","theme":"...","idea":"...","format":"POV / Skit","hook":"...","caption":"..."},
    {"day":"Saturday","theme":"...","idea":"...","format":"Voiceover + B-roll","hook":"...","caption":"..."},
    {"day":"Sunday","theme":"Rest & Plan","idea":"Spend 30 mins replying to comments, save 5 trending audios, outline next week","format":"optional","hook":"","caption":"Engagement tip: reply to every comment in the first hour after posting"}
  ],
  "contentIdeas": [
    {"title":"Specific idea title","hook":"Exact opening line","format":"Face to Camera","why":"Why this works specifically for their niche and audience","potential":"Explosive","emoji":"emoji"},
    {"title":"...","hook":"...","format":"Text on Screen + Music","why":"...","potential":"Very High","emoji":"..."},
    {"title":"...","hook":"...","format":"Tutorial","why":"...","potential":"High","emoji":"..."},
    {"title":"...","hook":"...","format":"POV / Skit","why":"...","potential":"Explosive","emoji":"..."},
    {"title":"...","hook":"...","format":"Voiceover + B-roll","why":"...","potential":"Very High","emoji":"..."},
    {"title":"...","hook":"...","format":"Trend","why":"...","potential":"High","emoji":"..."}
  ],
  "performanceTips": {
    "quickWins": [
      "Concrete action to take TODAY for immediate impact",
      "Second concrete action this week",
      "Third action to implement this week"
    ],
    "metrics": [
      "Watch time / completion rate — this tells you if your hooks and pacing work",
      "Follower growth rate week-over-week — indicates if your content is pulling new viewers",
      "Comment sentiment — qualitative signal of community connection"
    ],
    "levelUpTip": "Specific advice for going from ${p.followers} to the next milestone",
    "struggleFix": "Direct, actionable advice for '${p.struggle}' — be specific to their niche"
  }
}`
      const raw = await groqChat(prompt, SYS, 2500)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Strategy failed to parse. Please try again.')
      setStrategy(parsed)
      saveData(profileData, parsed)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function generateCompetitors() {
    if (!profile) return
    setLoadingCompetitors(true)
    setCompetitors(null)
    try {
      const [s1, s2, s3] = await Promise.all([
        webSearch(`top ${profile.niche} creators TikTok most followed viral 2025`),
        webSearch(`best ${profile.niche} Instagram Reels accounts to follow 2025`),
        webSearch(`${profile.niche} TikTok influencers content strategy what makes them grow`),
      ])
      const webCtx = [s1,s2,s3].filter(Boolean).join('\n\n---\n\n')

      const prompt = `You are analysing competitors for a ${profile.niche} creator on ${profile.platforms.join(' & ')}.
Their style: ${profile.style}. Their goal: ${profile.goal}.
${webCtx ? `\nREAL WEB DATA about creators in this space:\n${webCtx}` : ''}

Generate a competitor analysis with 5 real or realistic competitor profiles in the ${profile.niche} space.
If web data contains real creator names, use them. Otherwise create realistic examples.

Return ONLY valid JSON:
{
  "summary": "2-sentence overview of the competitive landscape in this niche",
  "competitors": [
    {
      "name": "Creator name or @handle",
      "platform": "TikTok|Instagram|Both",
      "followers": "approximate follower count e.g. 2.3M",
      "niche": "their specific sub-niche within ${profile.niche}",
      "contentStyle": "How they present content — tone, format, energy",
      "postingFreq": "How often they post",
      "topFormats": ["format 1","format 2","format 3"],
      "whatWorks": "2 sentences on exactly why their content performs well",
      "signatureHook": "Example of their typical opening hook style",
      "weaknesses": "1 sentence on a gap or weakness you can exploit",
      "inspireIdea": "One specific content idea you can take inspiration from (not copy)"
    },
    {"name":"...","platform":"...","followers":"...","niche":"...","contentStyle":"...","postingFreq":"...","topFormats":["..."],"whatWorks":"...","signatureHook":"...","weaknesses":"...","inspireIdea":"..."},
    {"name":"...","platform":"...","followers":"...","niche":"...","contentStyle":"...","postingFreq":"...","topFormats":["..."],"whatWorks":"...","signatureHook":"...","weaknesses":"...","inspireIdea":"..."},
    {"name":"...","platform":"...","followers":"...","niche":"...","contentStyle":"...","postingFreq":"...","topFormats":["..."],"whatWorks":"...","signatureHook":"...","weaknesses":"...","inspireIdea":"..."},
    {"name":"...","platform":"...","followers":"...","niche":"...","contentStyle":"...","postingFreq":"...","topFormats":["..."],"whatWorks":"...","signatureHook":"...","weaknesses":"...","inspireIdea":"..."}
  ],
  "yourEdge": "2 sentences: what gap exists in the market that this specific creator can fill that none of these competitors are doing",
  "doThis": ["3 specific actions inspired by competitor analysis the creator should do this week"]
}`
      const raw = await groqChat(prompt, SYS, 2000)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Could not generate competitor analysis.')
      setCompetitors(parsed)
      // Save competitors alongside strategy
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')
        localStorage.setItem(STORAGE_KEY, JSON.stringify({...saved, competitors: parsed}))
      } catch {}
    } catch(e) { setError(e.message) }
    finally { setLoadingCompetitors(false) }
  }

  async function generateScript(idea) {
    setScripts(s => ({...s, [idea.title]: {loading:true, data:null}}))
    try {
      const webCtx = await webSearch(`${profile?.niche} ${idea.format} TikTok viral script hook structure 2025`)
      const prompt = `Write a complete, detailed, word-for-word short-form video script.

Creator: ${profile?.name}
Niche: ${profile?.niche}
Style: ${profile?.style}
Followers: ${profile?.followers}
Platform: ${profile?.platforms?.join(' & ')}

Video idea: "${idea.title}"
Suggested hook: "${idea.hook}"
Format: ${idea.format}
${webCtx ? `\nWhat's working in this space right now:\n${webCtx}` : ''}

IMPORTANT RULES:
- Write EXACT words, not descriptions of what to say
- Hook must be under 5 words and immediately create curiosity or shock
- Body points must be complete sentences the creator can read directly
- CTA must feel natural, not corporate
- Make it sound like a real human talking, not a script
- Every line should serve a purpose — no filler

Return ONLY valid JSON:
{
  "hook": "Under-5-word scroll-stopping opener — exact words to say/show",
  "setup": "1 sentence immediately after the hook that builds on it and keeps viewer watching",
  "body": [
    "Point 1 — full exact sentence to say, with specific detail not generic advice",
    "Point 2 — full exact sentence, include a specific example or number if possible",
    "Point 3 — full exact sentence, build toward the payoff"
  ],
  "payoff": "The satisfying answer or resolution that rewards the viewer for watching",
  "cta": "Natural, casual call to action — exact words. Not 'follow me for more content'",
  "duration": "Estimated duration e.g. 32–40s",
  "editingTips": ["Tip 1 specific to this format","Tip 2 on pacing or cuts","Tip 3 on audio or captions"],
  "captionSuggestion": "Ready-to-use caption with hooks and hashtag strategy"
}`
      const raw = await groqChat(prompt, SYS, 1200)
      const data = safeParseJSON(raw)
      setScripts(s => ({...s, [idea.title]: {loading:false, data}}))
    } catch {
      setScripts(s => ({...s, [idea.title]: {loading:false, data:null, error:true}}))
    }
  }

  async function generateNewIdeas() {
    setLoadingNewIdeas(true)
    try {
      const [s1,s2] = await Promise.all([
        webSearch(`trending ${profile?.niche} TikTok content viral ideas 2025`),
        webSearch(`${profile?.niche} Instagram Reels top performing content formats 2025`),
      ])
      const webCtx = [s1,s2].filter(Boolean).join('\n\n---\n\n')
      const p = profile
      const prompt = `Generate 6 FRESH, creative, specific content ideas for this creator.
DO NOT generate generic ideas. Each idea must be unique, niche-specific, and immediately actionable.

Creator: ${p?.name}, Niche: ${p?.niche}, Style: ${p?.style}, Goal: ${p?.goal}, Followers: ${p?.followers}
${webCtx ? `\nCURRENT TREND DATA:\n${webCtx}` : ''}

Return ONLY a JSON array of exactly 6 objects:
[
  {"title":"Specific idea title","hook":"Exact opening hook line — under 8 words","format":"Face to Camera","why":"Why this specific idea will resonate with their exact audience","potential":"Explosive","emoji":"emoji"},
  {"title":"...","hook":"...","format":"Text on Screen + Music","why":"...","potential":"Very High","emoji":"..."},
  {"title":"...","hook":"...","format":"Tutorial","why":"...","potential":"High","emoji":"..."},
  {"title":"...","hook":"...","format":"POV / Skit","why":"...","potential":"Explosive","emoji":"..."},
  {"title":"...","hook":"...","format":"Voiceover + B-roll","why":"...","potential":"Very High","emoji":"..."},
  {"title":"...","hook":"...","format":"Trend","why":"...","potential":"High","emoji":"..."}
]`
      const raw = await groqChat(prompt, SYS, 1200)
      const newIdeas = safeParseJSON(raw)
      if (newIdeas && Array.isArray(newIdeas)) {
        const updated = {...strategy, contentIdeas:newIdeas}
        setStrategy(updated)
        setScripts({})
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')
          localStorage.setItem(STORAGE_KEY, JSON.stringify({...saved, strategy:updated}))
        } catch {}
      }
    } catch(e) { console.error('generateNewIdeas:', e) }
    finally { setLoadingNewIdeas(false) }
  }

  function reset() {
    setProfile(null); setStrategy(null); setCompetitors(null)
    setError(null); setWebUsed(false); setScripts({}); setLoadingNewIdeas(false)
  }

  return {
    profile, strategy, competitors, loading, loadingCompetitors,
    loadingNewIdeas, error, webUsed, scripts,
    setError, restoreSession, reset,
    generateStrategy, generateScript, generateNewIdeas, generateCompetitors,
  }
}
