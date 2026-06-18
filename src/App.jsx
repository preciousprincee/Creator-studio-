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
    profile, strategy, loading, error, webUsed,
    scripts, loadingNewIdeas,
    setError, restoreSession, reset,
    generateStrategy, generateScript, generateNewIdeas,
  } = useCreator()

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('aria_dark_mode', String(dark)) } catch {}
  }, [dark])

  // Restore session on mount
  useEffect(() => {
    const saved = loadSaved()
    if (saved?.profile && saved?.strategy) {
      restoreSession(saved)
      setScreen('dashboard')
    } else {
      setScreen('onboarding')
    }
  }, []) // eslint-disable-line

  // KEY FIX: switch to dashboard when strategy is set (catches async edge cases)
  useEffect(() => {
    if (strategy && screen === 'onboarding') {
      setScreen('dashboard')
    }
  }, [strategy]) // eslint-disable-line

  async function handleOnboardingComplete(formData) {
    await generateStrategy(formData)
    // screen transition handled by the useEffect above
  }

  function handleReset() {
    clearSaved()
    reset()
    setScreen('onboarding')
  }

  function goSettings()       { setPrevScreen(screen); setScreen('settings') }
  function backFromSettings() { setScreen(prevScreen) }

  const hasGroqKey   = !!getApiKey()
  const hasTavilyKey = !!getTavilyKey()

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terra-200 to-sand-300 shadow-warm flex items-center justify-center text-3xl font-display mx-auto mb-3 animate-bounce-soft">✦</div>
          <p className="text-ink-400 dark:text-gray-500 text-sm font-mono">Restoring your session…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-950 transition-colors duration-300">

      {/* Floating controls — only shown when NOT on settings screen, positioned to not overlap header */}
      {screen !== 'settings' && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {!hasGroqKey && (
            <button onClick={goSettings} className="hidden sm:inline text-[11px] font-mono text-terra-600 dark:text-terra-400 bg-terra-100 dark:bg-terra-900 border border-terra-200 dark:border-terra-800 rounded-full px-2.5 py-1 hover:bg-terra-200 transition-colors">
              Add API key ↗
            </button>
          )}
          {hasGroqKey && hasTavilyKey && (
            <span className="hidden sm:inline text-[10px] font-mono text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-900 border border-sage-200 dark:border-sage-800 rounded-full px-2.5 py-1">
              🌐 web on
            </span>
          )}
          <button
            onClick={() => setDark(d => !d)}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-cream-300 dark:border-gray-700 shadow-warm-sm flex items-center justify-center text-ink-400 dark:text-gray-400 hover:text-ink-700 dark:hover:text-gray-200 transition-all"
          >
            {dark ? <Sun size={15}/> : <Moon size={15}/>}
          </button>
          <button
            onClick={goSettings}
            className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-cream-300 dark:border-gray-700 shadow-warm-sm flex items-center justify-center text-ink-400 dark:text-gray-400 hover:text-ink-700 dark:hover:text-gray-200 transition-all"
          >
            <SettingsIcon size={15}/>
          </button>
        </div>
      )}

      {screen === 'settings' && <Settings onBack={backFromSettings} />}

      {screen === 'onboarding' && (
        <Onboarding
          onComplete={handleOnboardingComplete}
          loading={loading}
          error={error}
          onClearError={() => setError(null)}
        />
      )}

      {screen === 'dashboard' && profile && strategy && (
        <Dashboard
          profile={profile}
          strategy={strategy}
          webUsed={webUsed}
          onReset={handleReset}
          generateScript={generateScript}
          generateNewIdeas={generateNewIdeas}
          scripts={scripts}
          loadingNewIdeas={loadingNewIdeas}
        />
      )}

      {/* Fallback: dashboard screen but data missing */}
      {screen === 'dashboard' && (!profile || !strategy) && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">😕</div>
            <p className="font-display text-xl text-ink-800 dark:text-gray-200 mb-2">Couldn't load session</p>
            <p className="text-ink-500 dark:text-gray-400 text-sm mb-6">Let's start fresh.</p>
            <button onClick={handleReset} className="btn-primary">Start over</button>
          </div>
        </div>
      )}
    </div>
  )
}
