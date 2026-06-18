const GROQ_API   = 'https://api.groq.com/openai/v1/chat/completions'
const TAVILY_API = 'https://api.tavily.com/search'
const MODEL      = 'llama-3.3-70b-versatile'

export const getApiKey    = () => localStorage.getItem('groq_api_key')   || import.meta.env.VITE_GROQ_API_KEY   || ''
export const getTavilyKey = () => localStorage.getItem('tavily_api_key') || import.meta.env.VITE_TAVILY_API_KEY || ''

// Tavily: searches the live web for current trends, viral content, platform data
// Returns a compact string injected into AI prompts so responses are grounded in real data
export async function webSearch(query, maxResults = 4) {
  const apiKey = getTavilyKey()
  if (!apiKey) return null
  try {
    const res = await fetch(TAVILY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, search_depth: 'basic', max_results: maxResults, include_answer: true }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const snippets = (data.results || []).map(r => `[${r.title}]: ${r.content?.slice(0, 260)}`).join('\n')
    return (data.answer ? `Summary: ${data.answer}\n\n` : '') + snippets
  } catch { return null }
}

export async function groqChat(prompt, systemPrompt = '', maxTokens = 1800) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')
  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.8,
      max_tokens: maxTokens,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (res.status === 401) throw new Error('INVALID_KEY')
    throw new Error(err?.error?.message || `Groq error ${res.status}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export function safeParseJSON(raw) {
  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    const s = clean.search(/[[{]/)
    const e = Math.max(clean.lastIndexOf(']'), clean.lastIndexOf('}')) + 1
    return JSON.parse(clean.slice(s, e))
  } catch { return null }
}
