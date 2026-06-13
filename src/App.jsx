import { useState } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { useCreator } from './hooks/useCreator'
import { getApiKey, getTavilyKey } from './lib/groq'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Describe from './components/Describe'
import Ideas from './components/Ideas'
import Research from './components/Research'
import Settings from './components/Settings'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [prevScreen, setPrevScreen] = useState('home')
  const [path, setPath] = useState(null)

  const {
    ideas, selectedIdea, setSelectedIdea,
    research, script,
    loadingIdeas, loadingResearch, loadingScript,
    searchStatus, webSearchUsed,
    error, clearError,
    generateIdeasFromQuiz, generateIdeasFromDescription,
    generateResearch, generateScript,
    reset,
  } = useCreator()

  function go(s) { setPrevScreen(screen); setScreen(s) }
  function goHome() { reset(); setPath(null); setScreen('home') }

  const hasGroqKey = !!getApiKey()
  const hasTavilyKey = !!getTavilyKey()

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
    setScreen(path === 'quiz' ? 'quiz' : 'describe')
  }

  return (
    <div className="min-h-screen bg-[#06060f]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#1e1e35] bg-[#06060f]/90 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={goHome} className="font-display font-extrabold text-lg bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Creator Studio
          </button>
          <div className="flex items-center gap-2">
            {!hasGroqKey && screen !== 'settings' && (
              <span className="text-[11px] font-mono text-amber-500 bg-amber-950/40 border border-amber-800/40 rounded-full px-2.5 py-0.5">
                No API key
              </span>
            )}
            {hasGroqKey && hasTavilyKey && screen !== 'settings' && (
              <span className="text-[11px] font-mono text-sky-500 bg-sky-950/40 border border-sky-800/40 rounded-full px-2.5 py-0.5">
                🌐 Web search on
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

      <main>
        {screen === 'settings' && <Settings onBack={() => go(prevScreen)} />}

        {screen === 'home' && (
          <Home
            onQuiz={() => { setPath('quiz'); go('quiz') }}
            onDescribe={() => { setPath('describe'); go('describe') }}
          />
        )}

        {screen === 'quiz' && (
          <Quiz onBack={goHome} onSubmit={handleQuizSubmit} loading={loadingIdeas} error={error} onClearError={clearError} />
        )}

        {screen === 'describe' && (
          <Describe onBack={goHome} onSubmit={handleDescribeSubmit} loading={loadingIdeas} error={error} onClearError={clearError} />
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
            searchStatus={searchStatus}
            webSearchUsed={webSearchUsed}
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
            searchStatus={searchStatus}
            webSearchUsed={webSearchUsed}
          />
        )}
      </main>
    </div>
  )
}
