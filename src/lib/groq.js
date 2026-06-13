const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama3-70b-8192'

export function getApiKey() {
  return localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || ''
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
      max_tokens: 1200,
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
