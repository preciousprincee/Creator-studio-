import { useState } from 'react'
import { Key, CheckCircle, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { getApiKey } from '../lib/groq'
import { BackButton, ErrorBanner } from './UI'

export default function Settings({ onBack }) {
  const [key, setKey] = useState(getApiKey())
  const [saved, setSaved] = useState(false)
  const [show, setShow] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testError, setTestError] = useState(null)

  function save() {
    localStorage.setItem('groq_api_key', key.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function test() {
    setTesting(true)
    setTestError(null)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key.trim()}` },
        body: JSON.stringify({
          model: 'llama3-70b-8192', max_tokens: 10,
          messages: [{ role: 'user', content: 'Say hi' }],
        }),
      })
      if (!res.ok) throw new Error('INVALID_KEY')
      save()
    } catch (e) {
      setTestError(e.message === 'INVALID_KEY' ? 'INVALID_KEY' : 'Failed to connect. Check your internet and key.')
    } finally {
      setTesting(false)
    }
  }

  const masked = key ? key.slice(0, 6) + '•'.repeat(Math.max(0, key.length - 10)) + key.slice(-4) : ''

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-up">
      <BackButton onClick={onBack} />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <Key size={18} className="text-violet-400" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Settings</h1>
          <p className="text-zinc-500 text-sm">API configuration</p>
        </div>
      </div>

      <div className="bg-base-900 border border-base-600 rounded-2xl p-6 mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">Groq API Key</p>
        <p className="text-zinc-400 text-sm mb-4">
          Get your free API key from{' '}
          <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1">
            console.groq.com <ExternalLink size={12} />
          </a>
        </p>

        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => { setKey(e.target.value); setSaved(false) }}
            placeholder="gsk_..."
            className="w-full bg-base-800 border border-base-600 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors pr-12 font-mono"
          />
          <button
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {testError && <ErrorBanner message={testError} onDismiss={() => setTestError(null)} />}

        <div className="flex gap-3 mt-4">
          <button
            onClick={save}
            disabled={!key.trim()}
            className="btn-ghost flex-1 text-sm py-2.5"
          >
            Save
          </button>
          <button
            onClick={test}
            disabled={!key.trim() || testing}
            className="btn-primary flex-1 text-sm py-2.5"
          >
            {testing ? 'Testing...' : 'Test & Save'}
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm">
            <CheckCircle size={15} /> Key saved successfully
          </div>
        )}
      </div>

      <div className="bg-base-900 border border-base-600 rounded-2xl p-5">
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-3">About</p>
        <div className="space-y-2 text-sm text-zinc-500">
          <p>🎬 Creator Studio — TikTok & Reels AI</p>
          <p>⚡ Powered by Groq (llama3-70b-8192)</p>
          <p>🔒 Your key is stored locally, never sent to our servers</p>
        </div>
      </div>
    </div>
  )
}
