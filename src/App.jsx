import { useState, useEffect } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { useCreator } from './hooks/useCreator'
import { getApiKey, getTavilyKey } from './lib/groq'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'

const STORAGE_KEY = 'aria_user_data'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToDisk(profile, strategy) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, strategy, savedAt: Date.now() }))
  } catch {}
}

function clearDisk() {
  localStorage.removeItem(STORAGE_KEY)
}

export default function App() {
  const [screen, setScreen] = useState('loading') // loading | onboarding | dashboard | settings
  const [prevScreen, setPrevScreen] = useState('dashboard')

  const {
    profile, strategy, loading, loadingSection,
    error, webUsed,
    generateStrategy, generateScript, reset, setError,
    setProfileDirect, setStrategyDirect,
  } = useCreator()

  // On mount: restore saved session
  useEffect(() => {
    const saved = loadSaved()
    if (saved?.profile && saved?.strategy) {
      setProfileDirect(saved.profile)
      setStrategyDirect(saved.strategy)
      setScreen('dashboard')
    } else {
      setScreen('onboarding')
    }
  }, [])

  // Persist whenever strategy changes
  useEffect(() => {
    if (profile && strategy) saveToDisk(profile, strategy)
  }, [profile, strategy])

  function goSettings() { setPrevScreen(screen); setScreen('settings') }
  function backFromSettings() { setScreen(prevScreen) }

  async function handleOnboardingComplete(formData) {
    await generateStrategy(formData)
    setScreen('dashboard')
  }

  function handleReset() {
    clearDisk()
    reset()
    setScreen('onboarding')
  }

  const hasGroqKey = !!getApiKey()
  const hasTavilyKey = !!getTavilyKey()

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-warm-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terra-200 to-sand-300 shadow-warm flex items-center justify-center text-3xl mx-auto mb-3 animate-bounce-soft">✦</div>
          <p className="text-ink-400 text-sm font-mono">Loading your session…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gradient">
      {/* Floating settings button — shown on onboarding & dashboard */}
      {screen !== 'settings' && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {!hasGroqKey && (
            <span className="text-[11px] font-mono text-terra-600 bg-terra-100 border border-terra-200 rounded-full px-2.5 py-1">
              Add API key ↗
            </span>
          )}
          {hasGroqKey && hasTavilyKey && (
            <span className="text-[10px] font-mono text-sage-600 bg-sage-100 border border-sage-200 rounded-full px-2.5 py-1">
              🌐 web on
            </span>
          )}
          <button
            onClick={goSettings}
            className="w-9 h-9 rounded-xl bg-white border border-cream-300 shadow-warm-sm flex items-center justify-center text-ink-400 hover:text-ink-700 hover:border-cream-400 transition-all"
          >
            <SettingsIcon size={15} />
          </button>
        </div>
      )}

      {screen === 'settings' && (
        <Settings onBack={backFromSettings} />
      )}

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
          loadingSection={loadingSection}
        />
      )}
    </div>
  )
}
