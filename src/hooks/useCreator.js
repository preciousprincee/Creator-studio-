import { useState } from 'react'
import { groqChat, safeParseJSON, webSearch } from '../lib/groq'

const SYSTEM = `You are a viral short-form content strategist specializing in TikTok and Instagram Reels.
You deeply understand trending formats, hooks, sounds, and what drives engagement in 2024-2025.
When web search results are provided, prioritize that real-world data over general knowledge.
Always respond with raw JSON only — no markdown fences, no explanation, no preamble.`

export function useCreator() {
  const [ideas, setIdeas] = useState([])
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [research, setResearch] = useState(null)
  const [script, setScript] = useState(null)
  const [loadingIdeas, setLoadingIdeas] = useState(false)
  const [loadingResearch, setLoadingResearch] = useState(false)
  const [loadingScript, setLoadingScript] = useState(false)
  const [searchStatus, setSearchStatus] = useState(null) // 'searching' | 'done' | null
  const [error, setError] = useState(null)
  const [webSearchUsed, setWebSearchUsed] = useState(false)

  function clearError() { setError(null) }

  async function fetchTrendContext(queries) {
    setSearchStatus('searching')
    const results = await Promise.all(queries.map(q => webSearch(q, 4)))
    const combined = results.filter(Boolean).join('\n\n---\n\n')
    setSearchStatus('done')
    setWebSearchUsed(!!combined)
    return combined || null
  }

  async function generateIdeasFromQuiz({ niche, audience, goal }) {
    setLoadingIdeas(true)
    setError(null)
    setIdeas([])
    setSelectedIdea(null)
    setResearch(null)
    setScript(null)
    setWebSearchUsed(false)

    try {
      const trendData = await fetchTrendContext([
        `trending TikTok ${niche} content 2025`,
        `viral Instagram Reels ${niche} ideas 2025`,
        `top ${niche} creators TikTok what works`,
      ])

      const webCtx = trendData
        ? `\n\nLIVE WEB SEARCH DATA (use this to ground your ideas in what's actually trending right now):\n${trendData}`
        : ''

      const prompt = `Generate 4 viral short-form content ideas for TikTok and Instagram Reels.

Creator profile:
- Niche: ${niche}
- Target audience: ${audience}
- Goal: ${goal}
${webCtx}

For each idea, recommend the BEST content format and explain why in one sentence.
Make the ideas specific, timely, and grounded in what's actually working right now.

Return a JSON array of exactly 4 objects:
[
  {
    "title": "catchy idea title",
    "hook": "opening hook line (first 3 seconds)",
    "format": "Face to Camera" | "Text on Screen + Music" | "Voiceover + B-roll" | "Tutorial / How-To" | "POV / Skit" | "Trend Participation",
    "formatReason": "one sentence why this format works best for this idea",
    "formatIcon": "one relevant emoji",
    "potential": "High" | "Very High" | "Explosive",
    "icon": "one relevant emoji for the idea topic",
    "trendBased": true | false
  }
]`

      const raw = await groqChat([{ role: 'user', content: prompt }], SYSTEM)
      const parsed = safeParseJSON(raw)
      if (!parsed || !Array.isArray(parsed)) throw new Error('Bad response from AI')
      setIdeas(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingIdeas(false)
      setSearchStatus(null)
    }
  }

  async function generateIdeasFromDescription({ niche, description }) {
    setLoadingIdeas(true)
    setError(null)
    setIdeas([])
    setSelectedIdea(null)
    setResearch(null)
    setScript(null)
    setWebSearchUsed(false)

    try {
      const trendData = await fetchTrendContext([
        `trending TikTok ${niche} content ideas 2025`,
        `viral ${niche} Reels hooks that work 2025`,
        `${niche} TikTok creator strategy what performs`,
      ])

      const webCtx = trendData
        ? `\n\nLIVE WEB SEARCH DATA (prioritize this — these are real trends happening now):\n${trendData}`
        : ''

      const prompt = `Generate 4 viral short-form content ideas for TikTok and Instagram Reels.

Creator context:
- Niche: ${niche}
- What they told us: "${description}"

These creators already know their niche but need fresh, specific ideas they haven't thought of.
Make the ideas concrete, specific, and different from obvious/generic content.
${webCtx}

For each idea, recommend the BEST content format and explain why.

Return a JSON array of exactly 4 objects:
[
  {
    "title": "catchy idea title",
    "hook": "opening hook line (first 3 seconds)",
    "format": "Face to Camera" | "Text on Screen + Music" | "Voiceover + B-roll" | "Tutorial / How-To" | "POV / Skit" | "Trend Participation",
    "formatReason": "one sentence why this format works best for this idea",
    "formatIcon": "one relevant emoji",
    "potential": "High" | "Very High" | "Explosive",
    "icon": "one relevant emoji for the idea topic",
    "trendBased": true | false
  }
]`

      const raw = await groqChat([{ role: 'user', content: prompt }], SYSTEM)
      const parsed = safeParseJSON(raw)
      if (!parsed || !Array.isArray(parsed)) throw new Error('Bad response from AI')
      setIdeas(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingIdeas(false)
      setSearchStatus(null)
    }
  }

  async function generateResearch(idea) {
    setLoadingResearch(true)
    setResearch(null)
    setScript(null)
    setError(null)
    setWebSearchUsed(false)

    try {
      const trendData = await fetchTrendContext([
        `"${idea.title}" TikTok viral strategy 2025`,
        `trending TikTok sounds ${idea.format} 2025`,
        `viral hooks ${idea.title} short form video`,
        `TikTok Instagram Reels best posting time engagement 2025`,
      ])

      const webCtx = trendData
        ? `\n\nLIVE WEB RESEARCH (use this to give real, specific, current recommendations):\n${trendData}`
        : ''

      const prompt = `Do a deep content research breakdown for this TikTok/Reels idea:

Title: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}
${webCtx}

Return a JSON object with specific, actionable, current data:
{
  "trending": ["3 specific trending topics/angles related to this idea right now"],
  "sounds": ["2-3 specific audio types or named trending sounds that fit this format"],
  "hooks": ["3 powerful alternative opening hook lines for the first 3 seconds"],
  "postTips": [
    "Specific best time to post with reasoning",
    "Caption style tip with a short example",
    "Hashtag strategy: specific mix to use"
  ],
  "competitorAngles": ["3 angles top creators in this space use that you can put your own spin on"],
  "webInsights": "1-2 sentence summary of what the web data revealed about this topic (or null if no web data)"
}`

      const raw = await groqChat([{ role: 'user', content: prompt }], SYSTEM)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Bad response from AI')
      setResearch(parsed)
      setWebSearchUsed(!!trendData)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingResearch(false)
      setSearchStatus(null)
    }
  }

  async function generateScript(idea) {
    setLoadingScript(true)
    setScript(null)
    setError(null)

    try {
      const trendData = await fetchTrendContext([
        `viral ${idea.format} script structure TikTok 2025`,
        `"${idea.title}" content script hook examples`,
      ])

      const webCtx = trendData
        ? `\n\nWEB CONTEXT (use to make the script feel current and relevant):\n${trendData}`
        : ''

      const prompt = `Write a short-form video script for TikTok/Instagram Reels.

Idea: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}
${webCtx}

Make it feel native to the platform — punchy, scroll-stopping, platform-aware.

Return a JSON object:
{
  "hook": "First 3 seconds — exact words to say or show on screen",
  "body": [
    "Point 1 — what to say/show (be specific and punchy)",
    "Point 2 — what to say/show",
    "Point 3 — what to say/show"
  ],
  "cta": "Final call to action (platform-native, not corporate)",
  "duration": "estimated duration e.g. 28–35s",
  "deliveryTip": "One specific tip on delivery, pacing, or editing style for this format"
}`

      const raw = await groqChat([{ role: 'user', content: prompt }], SYSTEM)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Bad response from AI')
      setScript(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingScript(false)
      setSearchStatus(null)
    }
  }

  function reset() {
    setIdeas([])
    setSelectedIdea(null)
    setResearch(null)
    setScript(null)
    setError(null)
    setSearchStatus(null)
    setWebSearchUsed(false)
  }

  return {
    ideas, selectedIdea, setSelectedIdea,
    research, script,
    loadingIdeas, loadingResearch, loadingScript,
    searchStatus, webSearchUsed,
    error, clearError,
    generateIdeasFromQuiz, generateIdeasFromDescription,
    generateResearch, generateScript,
    reset,
  }
}
