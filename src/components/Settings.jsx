import { useState } from 'react'
import { Key, Globe, ExternalLink, Eye, EyeOff, CheckCircle, Moon, Sun } from 'lucide-react'
import { getApiKey, getTavilyKey } from '../lib/groq'
import { BackButton, ErrorBanner } from './UI'

export default function Settings({ onBack, dark, onToggleDark }) {
  const [groqKey,  setGroqKey]  = useState(getApiKey())
  const [tavKey,   setTavKey]   = useState(getTavilyKey())
  const [showGroq, setShowGroq] = useState(false)
  const [showTav,  setShowTav]  = useState(false)
  const [groqSaved,setGroqSaved]= useState(false)
  const [tavSaved, setTavSaved] = useState(false)
  const [testing,  setTesting]  = useState(false)
  const [groqErr,  setGroqErr]  = useState(null)

  async function testAndSaveGroq() {
    setTesting(true); setGroqErr(null)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey.trim()}` },
        body: JSON.stringify({ model: 'llama3-70b-8192', max_tokens: 5, messages: [{ role: 'user', content: 'hi' }] }),
      })
      if (!res.ok) throw new Error('INVALID_KEY')
      localStorage.setItem('groq_api_key', groqKey.trim())
      setGroqSaved(true); setTimeout(() => setGroqSaved(false), 2500)
    } catch (e) {
      setGroqErr(e.message === 'INVALID_KEY' ? 'INVALID_KEY' : 'Connection failed. Check your key.')
    } finally { setTesting(false) }
  }

  function saveGroq() {
    localStorage.setItem('groq_api_key', groqKey.trim())
    setGroqSaved(true); setTimeout(() => setGroqSaved(false), 2000)
  }

  function saveTavily() {
    localStorage.setItem('tavily_api_key', tavKey.trim())
    setTavSaved(true); setTimeout(() => setTavSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-warm-gradient dark:bg-gray-950">
      <div className="max-w-lg mx-auto px-4 py-8 pt-16">
        <BackButton onClick={onBack} />

        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink-900 dark:text-gray-100 dark:text-gray-100 mb-1">Settings</h1>
          <p className="text-ink-400 dark:text-gray-500 dark:text-gray-500 text-sm">Your keys stay in your browser — never sent anywhere.</p>
        </div>

        {/* Appearance */}
        <div className="card p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sand-100 dark:bg-gray-700 border border-sand-200 dark:border-gray-600 flex items-center justify-center">
                {dark ? <Moon size={14} className="text-sand-500 dark:text-gray-400" /> : <Sun size={14} className="text-sand-500" />}
              </div>
              <div>
                <p className="font-display text-base text-ink-800 dark:text-gray-200 dark:text-gray-200">Appearance</p>
                <p className="text-xs text-ink-400 dark:text-gray-500 dark:text-gray-500">{dark ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={onToggleDark}
              className={clsx(
                'relative w-12 h-6 rounded-full transition-colors duration-200',
                dark ? 'bg-terra-400' : 'bg-cream-300 dark:bg-gray-600'
              )}
            >
              <span className={clsx(
                'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
                dark ? 'left-7' : 'left-1'
              )} />
            </button>
          </div>
        </div>

        {/* Groq key */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-terra-100 dark:bg-terra-900/40 border border-terra-200 dark:border-terra-800 flex items-center justify-center">
              <Key size={14} className="text-terra-500 dark:text-terra-400" />
            </div>
            <div>
              <p className="font-display text-base text-ink-800 dark:text-gray-200 dark:text-gray-200">Groq API Key</p>
              <p className="text-xs text-ink-400 dark:text-gray-500 dark:text-gray-500">Required · powers all AI features</p>
            </div>
          </div>
          <a href="https://console.groq.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-terra-500 hover:text-terra-600 dark:text-terra-400 mb-4">
            Get a free key at console.groq.com <ExternalLink size={10} />
          </a>
          <div className="relative mb-4">
            <input type={showGroq ? 'text' : 'password'} value={groqKey} onChange={e => setGroqKey(e.target.value)}
              placeholder="gsk_…" className="input pr-10 font-mono text-xs" />
            <button onClick={() => setShowGroq(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 dark:text-gray-600 dark:text-gray-600 hover:text-ink-600 dark:hover:text-gray-400">
              {showGroq ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {groqErr && <div className="mb-3"><ErrorBanner message={groqErr} onDismiss={() => setGroqErr(null)} /></div>}
          <div className="flex gap-2">
            <button onClick={saveGroq} className="btn-secondary flex-1 py-2.5 text-sm">Save</button>
            <button onClick={testAndSaveGroq} disabled={!groqKey.trim() || testing} className="btn-primary flex-1 py-2.5 text-sm">
              {testing ? 'Testing…' : 'Test & Save'}
            </button>
          </div>
          {groqSaved && <p className="flex items-center gap-1.5 text-sage-600 dark:text-sage-400 text-sm mt-3"><CheckCircle size={14} /> Saved!</p>}
        </div>

        {/* Tavily key */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-sage-100 dark:bg-sage-900/40 border border-sage-200 dark:border-sage-800 flex items-center justify-center">
              <Globe size={14} className="text-sage-500 dark:text-sage-400" />
            </div>
            <div className="flex-1 flex items-center gap-2">
              <p className="font-display text-base text-ink-800 dark:text-gray-200 dark:text-gray-200">Tavily API Key</p>
              <span className="text-[10px] font-mono bg-sage-100 dark:bg-sage-900/40 text-sage-600 dark:text-sage-400 border border-sage-200 dark:border-sage-800 rounded-full px-2 py-0.5">Optional</span>
            </div>
          </div>
          <p className="text-xs text-ink-300 dark:text-gray-600 dark:text-gray-600 mb-4 ml-10">
            Enables real-time web search · 1,000 free searches/month ·{' '}
            <a href="https://tavily.com" target="_blank" rel="noreferrer" className="text-sage-500 dark:text-sage-400 hover:underline">tavily.com</a>
          </p>
          <div className="relative mb-4">
            <input type={showTav ? 'text' : 'password'} value={tavKey} onChange={e => setTavKey(e.target.value)}
              placeholder="tvly-…" className="input pr-10 font-mono text-xs" />
            <button onClick={() => setShowTav(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 dark:text-gray-600 dark:text-gray-600 hover:text-ink-600 dark:hover:text-gray-400">
              {showTav ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <button onClick={saveTavily} disabled={!tavKey.trim()} className="btn-primary w-full py-2.5 text-sm">Save Tavily Key</button>
          {tavSaved && <p className="flex items-center gap-1.5 text-sage-600 dark:text-sage-400 text-sm mt-3"><CheckCircle size={14} /> Web search enabled!</p>}
        </div>

        <div className="card-soft p-5">
          <p className="label-tag mb-3">About</p>
          <div className="space-y-1.5 text-sm text-ink-400 dark:text-gray-500 dark:text-gray-500">
            <p>✦ Aria — Personal Content Strategist</p>
            <p>⚡ AI: Groq llama3-70b · Search: Tavily</p>
            <p>🔒 All keys stored locally — never shared</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function clsx(...args) { return args.filter(Boolean).join(' ') }
