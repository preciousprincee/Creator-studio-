import { useState } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { useCreator } from './hooks/useCreator'
import { getApiKey } from './lib/groq'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Describe from './components/Describe'
import Ideas from './components/Ideas'
import Research from './components/Research'
import Settings from './components/Settings'

// screens: home | quiz | describe | ideas | research | settings
export default function App() {
  const [screen, setScreen] = useState('home')
  const [prevScreen, setPrevScreen] = useState('home')
  const [path, setPath] = useState(null) // 'quiz' | 'describe'

  const {
    ideas, selectedIdea, setSelectedIdea,
    research, script,
    loadingIdeas, loadingResearch, loadingScript,
    error, clearError,
    generateIdeasFromQuiz, generateIdeasFromDescription,
    generateResearch, generateScript,
    reset,
  } = useCreator()

  function go(s) { setPrevScreen(screen); setScreen(s) }

  function goHome() { reset(); setPath(null); setScreen('home') }

  // No key warning banner
  const hasKey = !!getApiKey()

  async function handleQuizSubmit(data) {
    await generateIdeasFromQuiz(data)
    setScreen('ideas')
  }

  async function handleDescribeSubmit(data) {
    await generateIdeasFromDescription(data)
    setScreen('ideas')
  }

  async function handleResearch(idea) {
    setSelectedIdea(idea)
    await generateResearch(idea)
    setScreen('research')
  }

  function handleRegenerate() {
    if (path === 'quiz') setScreen('quiz')
    else setScreen('describe')
  }

  return (
    <div className="min-h-screen bg-[#06060f]">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-[#1e1e35] bg-[#06060f]/90 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={goHome}
            className="font-display font-extrabold text-lg bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"
          >
            Creator Studio
          </button>
          <div className="flex items-center gap-3">
            {!hasKey && screen !== 'settings' && (
              <span className="text-[11px] font-mono text-amber-500 bg-amber-950/40 border border-amber-800/40 rounded-full px-2.5 py-0.5">
                No API key
              </span>
            )}
            <button
              onClick={() => screen === 'settings' ? go(prevScreen) : go('settings')}
              className="w-8 h-8 rounded-lg bg-base-900 border border-base-600 hover:border-base-500 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-all"
            >
              <SettingsIcon size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* Screens */}
      <main>
        {screen === 'settings' && (
          <Settings onBack={() => go(prevScreen)} />
        )}

        {screen === 'home' && (
          <Home
            onQuiz={() => { setPath('quiz'); go('quiz') }}
            onDescribe={() => { setPath('describe'); go('describe') }}
          />
        )}

        {screen === 'quiz' && (
          <Quiz
            onBack={goHome}
            onSubmit={handleQuizSubmit}
            loading={loadingIdeas}
            error={error}
            onClearError={clearError}
          />
        )}

        {screen === 'describe' && (
          <Describe
            onBack={goHome}
            onSubmit={handleDescribeSubmit}
            loading={loadingIdeas}
            error={error}
            onClearError={clearError}
          />
        )}

        {screen === 'ideas' && (
          <Ideas
            ideas={ideas}
            selectedIdea={selectedIdea}
            onSelect={setSelectedIdea}
            onBack={() => go(path === 'quiz' ? 'quiz' : 'describe')}
            onRegenerate={handleRegenerate}
            onContinue={handleResearch}
            loading={loadingIdeas}
            loadingResearch={loadingResearch}
          />
        )}

        {screen === 'research' && selectedIdea && (
          <Research
            idea={selectedIdea}
            research={research}
            script={script}
            onBack={() => go('ideas')}
            onGenerateScript={() => generateScript(selectedIdea)}
            loading={loadingResearch}
            loadingScript={loadingScript}
          />
        )}
      </main>
    </div>
  )
}
