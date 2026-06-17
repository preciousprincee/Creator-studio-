import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react'
import { useCreator, loadSaved, clearSaved } from './hooks/useCreator'
import { getApiKey, getTavilyKey } from './lib/groq'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'

function getInitialDark() {
  try {
    const stored = localStorage.getItem('aria_dark_mode')
    if (stored !== null) return stored === 'true'
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export default function App() {
  const [screen,     setScreen]     = useState('loading')
  const [prevScreen, setPrevScreen] = useState('dashboard')
  const [dark,       setDark]       = useState(getInitialDark)

  const {
    profile, strategy, loading,
    error, webUsed,
    generateStrategy, generateScript,
    restoreSession, reset, setError,
  } = useCreator()

  // Sync dark class on <html>
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

  // KEY FIX: don't rely on return value — watch strategy state instead
  useEffect(() => {
    if (strategy && screen === 'onboarding') {
      setScreen('dashboard')
    }
  }, [strategy]) // eslint-disable-line

  async function handleOnboardingComplete(formData) {
    await generateStrategy(formData)
    // screen switch handled by the useEffect above
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
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terra-200 to-sand-300 shadow-warm flex items-center justify-center text-3xl mx-auto mb-3 animate-bounce-soft">✦</div>
          <p className="text-ink-400 dark:text-gray-500 text-sm font-mono">Restoring your session…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-950 transition-colors duration-300">

      {/* Floating controls — hidden on settings screen */}
      {screen !== 'settings' && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {!hasGroqKey && (
            <span className="hidden sm:inline text-[11px] font-mono text-terra-600 dark:text-terra-400 bg-terra-100 dark:bg-terra-900/40 border border-terra-200 dark:border-terra-700 rounded-full px-2.5 py-1">
              Add API key ↗
            </span>
          )}
          {hasGroqKey && hasTavilyKey && (
            <span className="hidden sm:inline text-[10px] font-mono text-sage-600 dark:text-sage-400 bg-sage-100 dark:bg-sage-900/40 border border-sage-200 dark:border-sage-700 rounded-full px-2.5 py-1">
              🌐 web on
            </span>
          )}
          <button
            onClick={() => setDark(d => !d)}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-cream-300 dark:border-gray-700 shadow-warm-sm flex items-center justify-center text-ink-400 dark:text-gray-400 hover:text-ink-700 dark:hover:text-gray-200 transition-all"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={goSettings}
            className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-cream-300 dark:border-gray-700 shadow-warm-sm flex items-center justify-center text-ink-400 dark:text-gray-400 hover:text-ink-700 dark:hover:text-gray-200 transition-all"
          >
            <SettingsIcon size={15} />
          </button>
        </div>
      )}

      {screen === 'settings'   && <Settings   onBack={backFromSettings} dark={dark} onToggleDark={() => setDark(d => !d)} />}
      {screen === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} loading={loading} error={error} onClearError={() => setError(null)} />}
      {screen === 'dashboard'  && profile && strategy && (
        <Dashboard profile={profile} strategy={strategy} webUsed={webUsed} onReset={handleReset} generateScript={generateScript} />
      )}
      {screen === 'dashboard'  && (!profile || !strategy) && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">😕</div>
            <p className="font-display text-xl text-ink-800 dark:text-gray-200 mb-2">Session couldn't load</p>
            <p className="text-ink-500 dark:text-gray-400 text-sm mb-6">Let's start fresh.</p>
            <button onClick={handleReset} className="btn-primary">Start over</button>
          </div>
        </div>
      )}
    </div>
  )
}
