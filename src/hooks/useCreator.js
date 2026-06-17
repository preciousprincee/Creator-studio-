import { useState, useCallback } from 'react'
import { groqChat, safeParseJSON, webSearch } from '../lib/groq'

const STORAGE_KEY = 'aria_user_data'

const SYS = `You are Aria, a warm, expert personal content strategist for TikTok and Instagram Reels creators.
You give specific, actionable, data-informed advice tailored to each creator's unique situation.
When web search data is provided, prioritize it for current trends.
Always reply with raw JSON only — no markdown fences, no preamble, no explanation.`

function persist(profile, strategy) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, strategy, savedAt: Date.now() }))
  } catch {}
}

export function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const d = JSON.parse(raw)
    if (d?.profile && d?.strategy) return d
    return null
  } catch { return null }
}

export function clearSaved() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

export function useCreator() {
  const [profile,        setProfile]        = useState(null)
  const [strategy,       setStrategy]       = useState(null)
  const [loading,        setLoading]        = useState(false)
  const [loadingSection, setLoadingSection] = useState(null)
  const [error,          setError]          = useState(null)
  const [webUsed,        setWebUsed]        = useState(false)

  // Restore a saved session directly into state
  const restoreSession = useCallback((saved) => {
    setProfile(saved.profile)
    setStrategy(saved.strategy)
    setWebUsed(false)
  }, [])

  const generateStrategy = useCallback(async (profileData) => {
    setLoading(true)
    setError(null)
    setStrategy(null)
    setWebUsed(false)
    setProfile(profileData)

    try {
      // Run web searches in parallel (silently skip if no Tavily key)
      const searches = await Promise.all([
        webSearch(`${profileData.niche} TikTok Instagram Reels growth strategy 2025`),
        webSearch(`trending ${profileData.niche} content ideas short form video 2025`),
        webSearch(`best posting times TikTok Instagram Reels ${profileData.niche} 2025`),
      ])
      const webCtx = searches.filter(Boolean).join('\n\n---\n\n')
      if (webCtx) setWebUsed(true)

      const p = profileData
      const prompt = `Build a complete personal content strategy for this creator.

CREATOR PROFILE:
- Name: ${p.name}
- Niche: ${p.niche}
- Platforms: ${p.platforms.join(', ')}
- Follower count: ${p.followers}
- Current posting frequency: ${p.postingFreq}
- Biggest struggle: ${p.struggle}
- Main goal: ${p.goal}
- Content style/vibe: ${p.style}
${webCtx ? `\nLIVE WEB DATA (use this for current trends):\n${webCtx}` : ''}

Return ONLY a valid JSON object with this exact shape (no markdown, no extra text):
{
  "greeting": "A warm 2-sentence personalized welcome from Aria referencing their niche and goal",
  "brandVoice": {
    "tone": ["descriptor 1", "descriptor 2", "descriptor 3"],
    "pillars": [
      { "name": "Pillar 1", "description": "what this covers", "emoji": "🎯" },
      { "name": "Pillar 2", "description": "what this covers", "emoji": "💡" },
      { "name": "Pillar 3", "description": "what this covers", "emoji": "🔥" }
    ],
    "avoid": ["thing to avoid 1", "thing to avoid 2"],
    "uniqueAngle": "One sentence on what makes this creator different"
  },
  "growthStrategy": {
    "summary": "2-sentence growth approach overview",
    "tactics": [
      { "title": "Tactic 1", "description": "specific action", "priority": "High", "timeframe": "Week 1-2" },
      { "title": "Tactic 2", "description": "specific action", "priority": "High", "timeframe": "Week 1-2" },
      { "title": "Tactic 3", "description": "specific action", "priority": "Medium", "timeframe": "Week 3-4" },
      { "title": "Tactic 4", "description": "specific action", "priority": "Medium", "timeframe": "Ongoing" }
    ],
    "postingSchedule": {
      "frequency": "X posts per week — reasoning",
      "bestTimes": ["Platform: Day HH:MM reason", "Platform: Day HH:MM reason"],
      "consistency": "Consistency tip for their level"
    }
  },
  "calendar": [
    { "day": "Monday",    "theme": "theme", "idea": "specific post idea", "format": "Face to Camera", "hook": "hook line", "caption": "caption tip" },
    { "day": "Tuesday",   "theme": "theme", "idea": "specific post idea", "format": "Text on Screen + Music", "hook": "hook line", "caption": "caption tip" },
    { "day": "Wednesday", "theme": "theme", "idea": "specific post idea", "format": "Tutorial / How-To", "hook": "hook line", "caption": "caption tip" },
    { "day": "Thursday",  "theme": "theme", "idea": "specific post idea", "format": "POV / Skit", "hook": "hook line", "caption": "caption tip" },
    { "day": "Friday",    "theme": "theme", "idea": "specific post idea", "format": "Trend Participation", "hook": "hook line", "caption": "caption tip" },
    { "day": "Saturday",  "theme": "theme", "idea": "specific post idea", "format": "Voiceover + B-roll", "hook": "hook line", "caption": "caption tip" },
    { "day": "Sunday",    "theme": "Rest & Engage", "idea": "Reply to comments, research trends, batch plan next week", "format": "optional", "hook": "", "caption": "Use this day to engage with your community" }
  ],
  "contentIdeas": [
    { "title": "Idea 1", "hook": "hook line", "format": "Face to Camera", "why": "why this works for them", "potential": "High", "emoji": "🎤" },
    { "title": "Idea 2", "hook": "hook line", "format": "Text on Screen + Music", "why": "why this works for them", "potential": "Very High", "emoji": "✍️" },
    { "title": "Idea 3", "hook": "hook line", "format": "Tutorial / How-To", "why": "why this works for them", "potential": "Explosive", "emoji": "📋" },
    { "title": "Idea 4", "hook": "hook line", "format": "POV / Skit", "why": "why this works for them", "potential": "Very High", "emoji": "🎭" },
    { "title": "Idea 5", "hook": "hook line", "format": "Voiceover + B-roll", "why": "why this works for them", "potential": "High", "emoji": "🎙️" },
    { "title": "Idea 6", "hook": "hook line", "format": "Trend Participation", "why": "why this works for them", "potential": "Explosive", "emoji": "🔥" }
  ],
  "performanceTips": {
    "quickWins": ["Quick win 1 for this week", "Quick win 2 for this week", "Quick win 3 for this week"],
    "metrics": ["Metric 1 and why to track it", "Metric 2 and why to track it", "Metric 3 and why to track it"],
    "levelUpTip": "Specific advice for getting from their current follower count to the next level",
    "struggleFix": "Direct, specific advice addressing: ${p.struggle}"
  }
}`

      const raw = await groqChat([{ role: 'user', content: prompt }], SYS)
      const parsed = safeParseJSON(raw)

      if (!parsed) {
        throw new Error('Aria had trouble building your strategy. Please try again.')
      }

      // Validate required fields exist
      if (!parsed.greeting || !parsed.brandVoice || !parsed.calendar || !parsed.contentIdeas) {
        throw new Error('Strategy was incomplete. Please try again.')
      }

      setStrategy(parsed)
      persist(profileData, parsed)
      return parsed // return so App.jsx can act on success

    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const generateScript = useCallback(async (idea, profileData) => {
    setLoadingSection('script-' + idea.title)
    try {
      const prompt = `Write a punchy short-form video script.

Creator: ${profileData?.niche} creator, ${profileData?.followers} followers, style: ${profileData?.style}
Idea: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}

Return ONLY valid JSON:
{
  "hook": "exact first 3 seconds word for word",
  "body": ["point 1 - specific", "point 2 - specific", "point 3 - specific"],
  "cta": "call to action line",
  "duration": "e.g. 30-45s",
  "tip": "one delivery or editing tip for this format"
}`
      const raw = await groqChat([{ role: 'user', content: prompt }], SYS)
      return safeParseJSON(raw)
    } catch { return null }
    finally { setLoadingSection(null) }
  }, [])

  const reset = useCallback(() => {
    setProfile(null)
    setStrategy(null)
    setError(null)
    setWebUsed(false)
    setLoadingSection(null)
  }, [])

  return {
    profile, strategy,
    loading, loadingSection,
    error, setError,
    webUsed,
    generateStrategy,
    generateScript,
    restoreSession,
    reset,
  }
}
