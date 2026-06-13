const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const TAVILY_API = 'https://api.tavily.com/search'
const MODEL = 'llama-3.3-70b-versatile'

export function getApiKey() {
  return localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || ''
}

export function getTavilyKey() {
  return localStorage.getItem('tavily_api_key') || import.meta.env.VITE_TAVILY_API_KEY || ''
}

export async function webSearch(query, maxResults = 5) {
  const apiKey = getTavilyKey()
  if (!apiKey) return null // silently skip if no key

  try {
    const res = await fetch(TAVILY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        max_results: maxResults,
        include_answer: true,
        include_raw_content: false,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    // Return a compact summary string for injection into prompts
    const snippets = (data.results || [])
      .map(r => `[${r.title}]: ${r.content?.slice(0, 300)}`)
      .join('\n')
    const answer = data.answer ? `Summary: ${data.answer}\n\n` : ''
    return answer + snippets
  } catch {
    return null
  }
}

export async function groqChat(messages, systemPrompt = '') {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')

  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.85,
      max_tokens: 1400,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages,
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
    const start = clean.indexOf('[') !== -1 ? clean.indexOf('[') : clean.indexOf('{')
    const end = clean.lastIndexOf(']') !== -1 ? clean.lastIndexOf(']') + 1 : clean.lastIndexOf('}') + 1
    return JSON.parse(clean.slice(start, end))
  } catch {
    return null
  }
}
