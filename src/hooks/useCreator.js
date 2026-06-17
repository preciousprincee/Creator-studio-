import { useState } from 'react'
import { groqChat, safeParseJSON, webSearch } from '../lib/groq'

const SYS = `You are Aria, a warm, expert personal content strategist for TikTok and Instagram Reels creators.
You give specific, actionable, data-informed advice tailored to each creator's unique situation.
When web search data is provided, prioritize it for current trends.
Always reply with raw JSON only — no markdown, no preamble, no explanation.`

export function useCreator() {
  const [profile,        setProfile]        = useState(null)
  const [strategy,       setStrategy]       = useState(null)
  const [loading,        setLoading]        = useState(false)
  const [loadingSection, setLoadingSection] = useState(null)
  const [error,          setError]          = useState(null)
  const [webUsed,        setWebUsed]        = useState(false)

  // Direct setters used by App.jsx to restore from localStorage
  function setProfileDirect(p)  { setProfile(p) }
  function setStrategyDirect(s) { setStrategy(s) }

  async function generateStrategy(profileData) {
    setLoading(true)
    setError(null)
    setStrategy(null)
    setWebUsed(false)
    setProfile(profileData)

    try {
      const searches = await Promise.all([
        webSearch(`${profileData.niche} TikTok Instagram Reels growth strategy 2025`),
        webSearch(`trending ${profileData.niche} content ideas short form video 2025`),
        webSearch(`best posting times TikTok Instagram Reels ${profileData.niche} 2025`),
      ])
      const webCtx = searches.filter(Boolean).join('\n\n---\n\n')
      setWebUsed(!!webCtx)

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
${webCtx ? `\nLIVE WEB DATA:\n${webCtx}` : ''}

Return a JSON object with this exact shape:
{
  "greeting": "A warm 2-sentence personalized welcome from Aria acknowledging their specific situation",
  "brandVoice": {
    "tone": ["3 tone descriptors e.g. 'Relatable & raw'"],
    "pillars": [
      { "name": "Pillar name", "description": "One sentence what this covers", "emoji": "emoji" },
      { "name": "...", "description": "...", "emoji": "..." },
      { "name": "...", "description": "...", "emoji": "..." }
    ],
    "avoid": ["2-3 things to avoid that don't match their brand"],
    "uniqueAngle": "One sentence: what makes this creator different from everyone else in their niche"
  },
  "growthStrategy": {
    "summary": "2-sentence overview of the growth approach for their level and goal",
    "tactics": [
      { "title": "Tactic title", "description": "Specific actionable explanation", "priority": "High|Medium", "timeframe": "e.g. Week 1-2" },
      { "title": "...", "description": "...", "priority": "...", "timeframe": "..." },
      { "title": "...", "description": "...", "priority": "...", "timeframe": "..." },
      { "title": "...", "description": "...", "priority": "...", "timeframe": "..." }
    ],
    "postingSchedule": {
      "frequency": "Recommended posts per week with reasoning",
      "bestTimes": ["Platform: Day Time reason", "Platform: Day Time reason"],
      "consistency": "One tip about consistency for their current level"
    }
  },
  "calendar": [
    { "day": "Monday",    "theme": "theme name", "idea": "specific post idea", "format": "format type", "hook": "opening hook line", "caption": "short caption tip" },
    { "day": "Tuesday",   "theme": "...", "idea": "...", "format": "...", "hook": "...", "caption": "..." },
    { "day": "Wednesday", "theme": "...", "idea": "...", "format": "...", "hook": "...", "caption": "..." },
    { "day": "Thursday",  "theme": "...", "idea": "...", "format": "...", "hook": "...", "caption": "..." },
    { "day": "Friday",    "theme": "...", "idea": "...", "format": "...", "hook": "...", "caption": "..." },
    { "day": "Saturday",  "theme": "...", "idea": "...", "format": "...", "hook": "...", "caption": "..." },
    { "day": "Sunday",    "theme": "rest or light", "idea": "engagement day — reply to comments, research trends", "format": "optional", "hook": "", "caption": "rest day tip" }
  ],
  "contentIdeas": [
    { "title": "idea title", "hook": "hook line", "format": "format", "why": "why this works for them specifically", "potential": "High|Very High|Explosive", "emoji": "emoji" },
    { "title": "...", "hook": "...", "format": "...", "why": "...", "potential": "...", "emoji": "..." },
    { "title": "...", "hook": "...", "format": "...", "why": "...", "potential": "...", "emoji": "..." },
    { "title": "...", "hook": "...", "format": "...", "why": "...", "potential": "...", "emoji": "..." },
    { "title": "...", "hook": "...", "format": "...", "why": "...", "potential": "...", "emoji": "..." },
    { "title": "...", "hook": "...", "format": "...", "why": "...", "potential": "...", "emoji": "..." }
  ],
  "performanceTips": {
    "quickWins": ["3 things to do THIS WEEK for immediate results"],
    "metrics": ["3 specific metrics to track and why"],
    "levelUpTip": "One piece of advice specific to their follower level to get to the next stage",
    "struggleFix": "Direct advice addressing their stated struggle: ${p.struggle}"
  }
}`

      const raw = await groqChat([{ role: 'user', content: prompt }], SYS)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Could not parse strategy. Please try again.')
      setStrategy(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function generateScript(idea, profileData) {
    setLoadingSection('script-' + idea.title)
    try {
      const prompt = `Write a punchy short-form video script.

Creator: ${profileData?.niche} creator, ${profileData?.followers} followers, style: ${profileData?.style}
Idea: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}

Return JSON only:
{
  "hook": "exact first 3 seconds — word for word",
  "body": ["point 1", "point 2", "point 3"],
  "cta": "call to action line",
  "duration": "e.g. 30–45s",
  "tip": "one specific delivery or editing tip for this format"
}`
      const raw = await groqChat([{ role: 'user', content: prompt }], SYS)
      return safeParseJSON(raw)
    } catch { return null }
    finally { setLoadingSection(null) }
  }

  function reset() {
    setProfile(null)
    setStrategy(null)
    setError(null)
    setWebUsed(false)
    setLoadingSection(null)
  }

  return {
    profile, strategy,
    loading, loadingSection,
    error, setError,
    webUsed,
    generateStrategy,
    generateScript,
    reset,
    setProfileDirect,
    setStrategyDirect,
  }
}
