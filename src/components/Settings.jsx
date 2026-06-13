import { useState } from 'react'
import { Key, CheckCircle, ExternalLink, Eye, EyeOff, Globe } from 'lucide-react'
import { getApiKey, getTavilyKey } from '../lib/groq'
import { BackButton, ErrorBanner } from './UI'

function KeyField({ label, icon: Icon, iconColor, value, onChange, placeholder, docsUrl, docsLabel, onTest, testing, saved, testError, onDismissError, note }) {
  const [show, setShow] = useState(false)
  return (
    <div className="bg-base-900 border border-base-600 rounded-2xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={15} className={iconColor} />
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">{label}</p>
      </div>
      <p className="text-zinc-400 text-sm mb-4">
        Get your key at{' '}
        <a href={docsUrl} target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1">
          {docsLabel} <ExternalLink size={11} />
        </a>
        {note && <span className="text-zinc-600"> · {note}</span>}
      </p>

      <div className="relative mb-4">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-base-800 border border-base-600 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors pr-12 font-mono"
        />
        <button onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {testError && <div className="mb-3"><ErrorBanner message={testError} onDismiss={onDismissError} /></div>}

      <div className="flex gap-3">
        <button onClick={() => { localStorage.setItem(label.toLowerCase().includes('groq') ? 'groq_api_key' : 'tavily_api_key', value.trim()); }} className="btn-ghost flex-1 text-sm py-2.5">
          Save
        </button>
        {onTest && (
          <button onClick={onTest} disabled={!value.trim() || testing} className="btn-primary flex-1 text-sm py-2.5">
            {testing ? 'Testing...' : 'Test & Save'}
          </button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 mt-3 text-emerald-400 text-sm">
          <CheckCircle size={14} /> Saved successfully
        </div>
      )}
    </div>
  )
}

export default function Settings({ onBack }) {
  const [groqKey, setGroqKey] = useState(getApiKey())
  const [tavilyKey, setTavilyKey] = useState(getTavilyKey())
  const [groqSaved, setGroqSaved] = useState(false)
  const [tavSaved, setTavSaved] = useState(false)
  const [groqTesting, setGroqTesting] = useState(false)
  const [groqError, setGroqError] = useState(null)

  async function testGroq() {
    setGroqTesting(true)
    setGroqError(null)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey.trim()}` },
        body: JSON.stringify({ model: 'llama3-70b-8192', max_tokens: 10, messages: [{ role: 'user', content: 'hi' }] }),
      })
      if (!res.ok) throw new Error('INVALID_KEY')
      localStorage.setItem('groq_api_key', groqKey.trim())
      setGroqSaved(true)
      setTimeout(() => setGroqSaved(false), 2500)
    } catch (e) {
      setGroqError(e.message === 'INVALID_KEY' ? 'INVALID_KEY' : 'Connection failed. Check key and try again.')
    } finally {
      setGroqTesting(false)
    }
  }

  function saveTavily() {
    localStorage.setItem('tavily_api_key', tavilyKey.trim())
    setTavSaved(true)
    setTimeout(() => setTavSaved(false), 2500)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-up">
      <BackButton onClick={onBack} />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <Key size={18} className="text-violet-400" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white">Settings</h1>
          <p className="text-zinc-500 text-sm">API keys · stored locally in your browser</p>
        </div>
      </div>

      {/* Groq key */}
      <KeyField
        label="Groq API Key (required)"
        icon={Key}
        iconColor="text-violet-400"
        value={groqKey}
        onChange={setGroqKey}
        placeholder="gsk_..."
        docsUrl="https://console.groq.com"
        docsLabel="console.groq.com"
        note="Free tier available"
        onTest={testGroq}
        testing={groqTesting}
        saved={groqSaved}
        testError={groqError}
        onDismissError={() => setGroqError(null)}
      />

      {/* Tavily key */}
      <div className="bg-base-900 border border-base-600 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={15} className="text-sky-400" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Tavily API Key (web search)</p>
          <span className="text-[10px] font-mono bg-sky-950/60 text-sky-400 border border-sky-800/40 rounded-full px-2 py-0.5">Optional</span>
        </div>
        <p className="text-zinc-400 text-sm mb-1">
          Enables real-time web search for current trends, viral sounds, and live data.{' '}
          <a href="https://tavily.com" target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1">
            tavily.com <ExternalLink size={11} />
          </a>
        </p>
        <p className="text-zinc-600 text-xs mb-4">Free tier: 1,000 searches/month · Without this key the app works great but uses AI knowledge only</p>

        <div className="relative mb-4">
          <TavilyKeyInput value={tavilyKey} onChange={setTavilyKey} />
        </div>

        <button onClick={saveTavily} disabled={!tavilyKey.trim()} className="btn-primary w-full text-sm py-2.5">
          Save Tavily Key
        </button>

        {tavSaved && (
          <div className="flex items-center gap-2 mt-3 text-emerald-400 text-sm">
            <CheckCircle size={14} /> Tavily key saved · web search enabled
          </div>
        )}
      </div>

      <div className="bg-base-900 border border-base-600 rounded-2xl p-5">
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-3">About</p>
        <div className="space-y-2 text-sm text-zinc-500">
          <p>🎬 Creator Studio — TikTok & Reels AI</p>
          <p>⚡ AI: Groq (llama3-70b-8192) · Search: Tavily</p>
          <p>🔒 All keys stored locally — never sent to our servers</p>
        </div>
      </div>
    </div>
  )
}

function TavilyKeyInput({ value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="tvly-..."
        className="w-full bg-base-800 border border-base-600 focus:border-sky-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors pr-12 font-mono"
      />
      <button onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
