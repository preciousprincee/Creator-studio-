import { useState } from 'react'
import { Key, Globe, ExternalLink, Eye, EyeOff, CheckCircle, RotateCcw } from 'lucide-react'
import { getApiKey, getTavilyKey } from '../lib/groq'
import { BackButton, ErrorBanner } from './UI'

export default function Settings({ onBack, dark, onReset }) {
  const [groqKey,   setGroqKey]  = useState(getApiKey())
  const [tavKey,    setTavKey]   = useState(getTavilyKey())
  const [showG,     setShowG]    = useState(false)
  const [showT,     setShowT]    = useState(false)
  const [groqSaved, setGroqSaved]= useState(false)
  const [tavSaved,  setTavSaved] = useState(false)
  const [testing,   setTesting]  = useState(false)
  const [groqErr,   setGroqErr]  = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  async function testAndSaveGroq() {
    setTesting(true); setGroqErr(null)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${groqKey.trim()}`},
        body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:5,messages:[{role:'user',content:'hi'}]}),
      })
      if (!res.ok) throw new Error('INVALID_KEY')
      localStorage.setItem('groq_api_key',groqKey.trim())
      setGroqSaved(true); setTimeout(()=>setGroqSaved(false),3000)
    } catch(e) { setGroqErr(e.message==='INVALID_KEY'?'INVALID_KEY':'Connection failed.') }
    finally { setTesting(false) }
  }

  function saveGroq()   { localStorage.setItem('groq_api_key',groqKey.trim()); setGroqSaved(true); setTimeout(()=>setGroqSaved(false),2000) }
  function saveTavily() { localStorage.setItem('tavily_api_key',tavKey.trim()); setTavSaved(true); setTimeout(()=>setTavSaved(false),2000) }

  return (
    <div className="min-h-screen" style={{background: dark?'#030712':'#fdfaf5'}}>
      <div className="max-w-lg mx-auto px-4 py-8">
        <BackButton onClick={onBack}/>
        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink-900 dark:text-gray-100 mb-1">Settings</h1>
          <p className="text-sm text-ink-400 dark:text-gray-500">Keys are stored locally — never sent to our servers.</p>
        </div>

        {/* Groq */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#fce8df',border:'1px solid #f0a98f'}}>
              <Key size={14} style={{color:'var(--terra)'}}/>
            </div>
            <div>
              <p className="font-display text-base text-ink-800 dark:text-gray-200">Groq API Key</p>
              <p className="text-xs text-ink-400 dark:text-gray-500">Required · powers all AI features</p>
            </div>
          </div>
          <a href="https://console.groq.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs mb-4" style={{color:'var(--terra)'}}>
            Get free key at console.groq.com <ExternalLink size={10}/>
          </a>
          <div className="relative mb-4">
            <input type={showG?'text':'password'} value={groqKey} onChange={e=>setGroqKey(e.target.value)}
              placeholder="gsk_..." className="input font-mono text-xs" style={{paddingRight:40}}/>
            <button onClick={()=>setShowG(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 dark:text-gray-600 hover:opacity-70">
              {showG?<EyeOff size={15}/>:<Eye size={15}/>}
            </button>
          </div>
          {groqErr && <div className="mb-3"><ErrorBanner message={groqErr} onDismiss={()=>setGroqErr(null)}/></div>}
          <div className="flex gap-2">
            <button onClick={saveGroq} disabled={!groqKey.trim()} className="btn-secondary flex-1 py-2.5 text-sm">Save</button>
            <button onClick={testAndSaveGroq} disabled={!groqKey.trim()||testing} className="btn-primary flex-1 py-2.5 text-sm">
              {testing?'Testing…':'Test & Save'}
            </button>
          </div>
          {groqSaved&&<p className="flex items-center gap-1.5 text-sm mt-3" style={{color:'var(--sage)'}}><CheckCircle size={14}/> Saved!</p>}
        </div>

        {/* New profile / reset */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'#fbe9e7',border:'1px solid #f3c9c4'}}>
              <RotateCcw size={14} style={{color:'#c0463a'}}/>
            </div>
            <div className="flex-1">
              <p className="font-display text-base text-ink-800 dark:text-gray-200">New Profile</p>
              <p className="text-xs text-ink-400 dark:text-gray-500">Clear your current profile and start fresh</p>
            </div>
          </div>
          {!confirmReset ? (
            <button onClick={()=>setConfirmReset(true)} className="btn-secondary w-full py-2.5 text-sm mt-3">
              Start a new profile
            </button>
          ) : (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs tm flex-1">Reset and lose current data?</span>
              <button onClick={onReset} className="text-xs px-3 py-2 rounded-xl" style={{color:'#ef4444',border:'1px solid #fca5a5'}}>Yes, reset</button>
              <button onClick={()=>setConfirmReset(false)} className="text-xs px-3 py-2 rounded-xl tm" style={{border:'1px solid var(--border2)'}}>Cancel</button>
            </div>
          )}
        </div>

        {/* Tavily */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'var(--sage-bg)',border:'1px solid var(--sage-bdr)'}}>
              <Globe size={14} style={{color:'var(--sage)'}}/>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-display text-base text-ink-800 dark:text-gray-200">Tavily Search Key</p>
                <span className="text-[10px] font-mono rounded-full px-2 py-0.5"
                  style={{background:'#e8f0eb',border:'1px solid #ccddd2',color:'#326944'}}>Optional</span>
              </div>
              <p className="text-xs text-ink-400 dark:text-gray-500">Live web search for real trends</p>
            </div>
          </div>
          <p className="text-xs ml-10 mb-3 text-ink-300 dark:text-gray-600">Free: 1,000 searches/month · <a href="https://tavily.com" target="_blank" rel="noreferrer" style={{color:'var(--sage)'}}>tavily.com</a></p>
          <div className="rounded-2xl p-3 mb-4" style={{background:'var(--sage-bg)',border:'1px solid var(--sage-bdr)'}}>
            <p className="text-xs leading-relaxed" style={{color:'var(--sage-text)'}}>
              💡 When enabled, Aria searches the web before building your strategy, ideas, scripts, and competitor research — so everything reflects what's actually working <strong>right now</strong>, not just training data.
            </p>
          </div>
          <div className="relative mb-4">
            <input type={showT?'text':'password'} value={tavKey} onChange={e=>setTavKey(e.target.value)}
              placeholder="tvly-..." className="input font-mono text-xs" style={{paddingRight:40}}/>
            <button onClick={()=>setShowT(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 dark:text-gray-600 hover:opacity-70">
              {showT?<EyeOff size={15}/>:<Eye size={15}/>}
            </button>
          </div>
          <button onClick={saveTavily} disabled={!tavKey.trim()} className="btn-primary w-full py-2.5 text-sm">Save Tavily Key</button>
          {tavSaved&&<p className="flex items-center gap-1.5 text-sm mt-3" style={{color:'var(--sage)'}}><CheckCircle size={14}/> Web search enabled!</p>}
        </div>

        <div className="card-soft p-5">
          <p className="label-tag mb-3">About</p>
          <div className="space-y-1.5 text-sm text-ink-400 dark:text-gray-500">
            <p>✦ Aria — Personal Content Strategist v2</p>
            <p>⚡ AI: Groq llama-3.3-70b-versatile</p>
            <p>🌐 Search: Tavily (optional)</p>
            <p>🔒 All data stored in your browser only</p>
          </div>
        </div>
      </div>
    </div>
  )
}
