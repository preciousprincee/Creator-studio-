import { useState } from 'react'
import { groqChat, safeParseJSON } from '../lib/groq'

const SYSTEM = `You are a viral short-form content strategist specializing in TikTok and Instagram Reels.
You deeply understand trending formats, hooks, sounds, and what drives engagement in 2024-2025.
Always respond with raw JSON only — no markdown fences, no explanation, no preamble.`

export function useCreator() {
  const [ideas, setIdeas] = useState([])
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [research, setResearch] = useState(null)
  const [script, setScript] = useState(null)
  const [loadingIdeas, setLoadingIdeas] = useState(false)
  const [loadingResearch, setLoadingResearch] = useState(false)
  const [loadingScript, setLoadingScript] = useState(false)
  const [error, setError] = useState(null)

  function clearError() { setError(null) }

  async function generateIdeasFromQuiz({ niche, audience, goal }) {
    setLoadingIdeas(true)
    setError(null)
    setIdeas([])
    setSelectedIdea(null)
    setResearch(null)
    setScript(null)
    try {
      const prompt = `Generate 4 viral short-form content ideas for TikTok and Instagram Reels.

Creator profile:
- Niche: ${niche}
- Target audience: ${audience}
- Goal: ${goal}

For each idea, also recommend the BEST content format and explain why in one sentence.

Return a JSON array of exactly 4 objects:
[
  {
    "title": "catchy idea title",
    "hook": "opening hook line (first 3 seconds)",
    "format": "Face to Camera" | "Text on Screen + Music" | "Voiceover + B-roll" | "Tutorial / How-To" | "POV / Skit" | "Trend Participation",
    "formatReason": "one sentence why this format works best for this idea",
    "formatIcon": "one relevant emoji",
    "potential": "High" | "Very High" | "Explosive",
    "icon": "one relevant emoji for the idea topic"
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
    }
  }

  async function generateIdeasFromDescription({ niche, description }) {
    setLoadingIdeas(true)
    setError(null)
    setIdeas([])
    setSelectedIdea(null)
    setResearch(null)
    setScript(null)
    try {
      const prompt = `Generate 4 viral short-form content ideas for TikTok and Instagram Reels.

Creator context:
- Niche/Type: ${niche}
- What they told us: "${description}"

These are creators who already know their niche but need fresh, specific content ideas they haven't thought of.
Make the ideas concrete, specific, and actionable — not generic.

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
    "icon": "one relevant emoji for the idea topic"
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
    }
  }

  async function generateResearch(idea) {
    setLoadingResearch(true)
    setResearch(null)
    setScript(null)
    setError(null)
    try {
      const prompt = `Do a deep content research breakdown for this TikTok/Reels idea:

Title: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}

Return a JSON object:
{
  "trending": ["3 trending topics/angles related to this idea"],
  "sounds": ["2-3 specific audio/sound trends that would work: be specific about the type e.g. 'Melancholic lo-fi beat under 60BPM', 'Trending podcast-clip audio'"],
  "hooks": ["3 alternative opening hook lines that would grab attention in the first 3 seconds"],
  "postTips": [
    "Best posting time tip",
    "Caption style tip with example",
    "Hashtag strategy tip"
  ],
  "competitorAngles": ["3 angles competitors use that you can put your own spin on"]
}`
      const raw = await groqChat([{ role: 'user', content: prompt }], SYSTEM)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Bad response from AI')
      setResearch(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingResearch(false)
    }
  }

  async function generateScript(idea) {
    setLoadingScript(true)
    setScript(null)
    setError(null)
    try {
      const prompt = `Write a short-form video script for TikTok/Instagram Reels.

Idea: "${idea.title}"
Hook: "${idea.hook}"
Format: ${idea.format}

Return a JSON object:
{
  "hook": "First 3 seconds — exact words to say or show on screen",
  "body": [
    "Point 1 — what to say/show",
    "Point 2 — what to say/show",
    "Point 3 — what to say/show"
  ],
  "cta": "Final call to action line",
  "duration": "estimated duration e.g. 28–35s",
  "deliveryTip": "one tip on delivery, pacing, or editing style for this specific format"
}`
      const raw = await groqChat([{ role: 'user', content: prompt }], SYSTEM)
      const parsed = safeParseJSON(raw)
      if (!parsed) throw new Error('Bad response from AI')
      setScript(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingScript(false)
    }
  }

  function reset() {
    setIdeas([])
    setSelectedIdea(null)
    setResearch(null)
    setScript(null)
    setError(null)
  }

  return {
    ideas, selectedIdea, setSelectedIdea,
    research, script,
    loadingIdeas, loadingResearch, loadingScript,
    error, clearError,
    generateIdeasFromQuiz, generateIdeasFromDescription,
    generateResearch, generateScript,
    reset,
  }
}
