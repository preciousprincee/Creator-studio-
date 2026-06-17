const GROQ_API   = 'https://api.groq.com/openai/v1/chat/completions'
const TAVILY_API = 'https://api.tavily.com/search'
const MODEL      = 'llama3-70b-8192'

export const getApiKey    = () => localStorage.getItem('groq_api_key')    || import.meta.env.VITE_GROQ_API_KEY    || ''
export const getTavilyKey = () => localStorage.getItem('tavily_api_key')  || import.meta.env.VITE_TAVILY_API_KEY  || ''

export async function webSearch(query, maxResults = 5) {
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
    const snippets = (data.results || []).map(r => `[${r.title}]: ${r.content?.slice(0, 280)}`).join('\n')
    return (data.answer ? `Summary: ${data.answer}\n\n` : '') + snippets
  } catch { return null }
}

export async function groqChat(messages, systemPrompt = '') {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')
  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL, temperature: 0.8, max_tokens: 2000,
      messages: [...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []), ...messages],
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
    const s = Math.min(...['[','{'].map(c => clean.indexOf(c)).filter(i => i !== -1))
    const e = Math.max(...[']','}'].map(c => clean.lastIndexOf(c))) + 1
    return JSON.parse(clean.slice(s, e))
  } catch { return null }
}
