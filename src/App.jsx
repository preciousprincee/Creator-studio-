import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react'
import { useCreator, loadSaved, clearSaved } from './hooks/useCreator'
import { getApiKey, getTavilyKey } from './lib/groq'
import Onboarding from './components/Onboarding'
import Dashboard  from './components/Dashboard'
import Settings   from './components/Settings'

function getInitialDark() {
  try {
    const s = localStorage.getItem('aria_dark_mode')
    if (s !== null) return s === 'true'
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export default function App() {
  const [screen,     setScreen]     = useState('loading')
  const [prevScreen, setPrevScreen] = useState('dashboard')
  const [dark,       setDark]       = useState(getInitialDark)

  const {
    profile, strategy, competitors, loading, loadingCompetitors,
    loadingNewIdeas, error, webUsed, scripts,
    setError, restoreSession, reset,
    generateStrategy, generateScript, generateNewIdeas, generateCompetitors,
  } = useCreator()

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else      document.documentElement.classList.remove('dark')
    try { localStorage.setItem('aria_dark_mode', String(dark)) } catch {}
  }, [dark])

  useEffect(() => {
    const saved = loadSaved()
    if (saved?.profile && saved?.strategy) { restoreSession(saved); setScreen('dashboard') }
    else setScreen('onboarding')
  }, []) // eslint-disable-line

  useEffect(() => {
    if (strategy && screen === 'onboarding') setScreen('dashboard')
  }, [strategy]) // eslint-disable-line

  async function handleOnboardingComplete(formData) { await generateStrategy(formData) }
  function handleReset()       { clearSaved(); reset(); setScreen('onboarding') }
  function goSettings()        { setPrevScreen(screen); setScreen('settings') }
  function backFromSettings()  { setScreen(prevScreen) }

  const hasKey    = !!getApiKey()
  const hasWebKey = !!getTavilyKey()

  if (screen === 'loading') return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'linear-gradient(135deg,var(--terra-bg),var(--sand-bg))',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 12px',
          animation:'bounceSoft 1.4s ease-in-out infinite'}}>✦</div>
        <p style={{color:'var(--text-muted)',fontSize:14,fontFamily:'monospace'}}>Restoring session…</p>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',transition:'background 0.3s'}}>

      {/* Floating toolbar: ONLY dark toggle + settings icon
          "New profile" lives inside Dashboard header to avoid overlap */}
      {screen !== 'settings' && (
        <div style={{position:'fixed',top:16,right:16,zIndex:50,display:'flex',alignItems:'center',gap:8}}>
          {!hasKey && (
            <button onClick={goSettings}
              style={{fontSize:11,fontFamily:'monospace',borderRadius:999,padding:'4px 10px',cursor:'pointer',
                background:'var(--terra-bg)',border:'1px solid var(--terra-bdr)',color:'var(--terra-text)'}}>
              Add API key ↗
            </button>
          )}
          {hasKey && hasWebKey && (
            <span style={{fontSize:10,fontFamily:'monospace',borderRadius:999,padding:'4px 10px',
              background:'var(--sage-bg)',border:'1px solid var(--sage-bdr)',color:'var(--sage-text)'}}>
              🌐 web on
            </span>
          )}
          <button onClick={()=>setDark(d=>!d)} title={dark?'Light mode':'Dark mode'}
            style={{width:36,height:36,borderRadius:12,cursor:'pointer',display:'flex',
              alignItems:'center',justifyContent:'center',transition:'all 0.2s',
              background:'var(--surface)',border:'1px solid var(--border2)',color:'var(--text-muted)'}}>
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
          </button>
          <button onClick={goSettings}
            style={{width:36,height:36,borderRadius:12,cursor:'pointer',display:'flex',
              alignItems:'center',justifyContent:'center',transition:'all 0.2s',
              background:'var(--surface)',border:'1px solid var(--border2)',color:'var(--text-muted)'}}>
            <SettingsIcon size={15}/>
          </button>
        </div>
      )}

      {screen === 'settings'   && <Settings onBack={backFromSettings}/>}
      {screen === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} loading={loading}
          error={error} onClearError={()=>setError(null)}/>
      )}
      {screen === 'dashboard' && profile && strategy && (
        <Dashboard
          profile={profile} strategy={strategy} competitors={competitors}
          webUsed={webUsed} onReset={handleReset} scripts={scripts}
          loadingNewIdeas={loadingNewIdeas} loadingCompetitors={loadingCompetitors}
          generateScript={generateScript} generateNewIdeas={generateNewIdeas}
          generateCompetitors={generateCompetitors}
        />
      )}
      {screen === 'dashboard' && (!profile || !strategy) && (
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
          <div style={{textAlign:'center',maxWidth:320}}>
            <div style={{fontSize:40,marginBottom:16}}>😕</div>
            <p className="font-display t1" style={{fontSize:20,marginBottom:8}}>Session couldn't load</p>
            <p className="tm text-sm" style={{marginBottom:24}}>Let's start fresh.</p>
            <button onClick={handleReset} className="btn-primary">Start over</button>
          </div>
        </div>
      )}
    </div>
  )
}
