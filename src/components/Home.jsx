import { Sparkles, BookOpen, Zap } from 'lucide-react'

const FEATURES = [
  { icon: '💡', label: 'Viral Ideas' },
  { icon: '🔥', label: 'Trend Research' },
  { icon: '✍️', label: 'Script Gen' },
]

export default function Home({ onQuiz, onDescribe }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 animate-fade-up">
      {/* Hero */}
      <div className="text-center max-w-md mb-12">
        <div className="text-5xl mb-5">🎬</div>
        <h1 className="font-display font-extrabold text-4xl mb-3 bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Creator Studio
        </h1>
        <p className="text-zinc-500 text-base leading-relaxed">
          Your AI-powered content engine for TikTok & Reels.
          From idea to script in minutes.
        </p>

        <div className="flex items-center justify-center gap-5 mt-5">
          {FEATURES.map(f => (
            <span key={f.label} className="text-[11px] font-mono text-zinc-600">
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Two paths */}
      <div className="w-full max-w-md space-y-3">
        {/* Quiz path */}
        <button
          onClick={onQuiz}
          className="w-full group bg-base-900 hover:bg-base-800 border border-base-600 hover:border-violet-600/50 rounded-2xl p-5 text-left transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center shrink-0 group-hover:bg-violet-600/30 transition-colors">
              <Sparkles size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base mb-1">Help me find my niche</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Answer 3 quick questions and get tailored content ideas with the best format suggestions.
              </p>
            </div>
          </div>
          <div className="mt-4 text-xs font-mono text-violet-500 group-hover:text-violet-400 transition-colors">
            Take the quiz →
          </div>
        </button>

        {/* Description path */}
        <button
          onClick={onDescribe}
          className="w-full group bg-base-900 hover:bg-base-800 border border-base-600 hover:border-pink-600/50 rounded-2xl p-5 text-left transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-600/30 flex items-center justify-center shrink-0 group-hover:bg-pink-600/30 transition-colors">
              <BookOpen size={18} className="text-pink-400" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base mb-1">I know my niche, need ideas</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Already creating content but stuck on what to post? Describe your niche and get fresh ideas instantly.
              </p>
            </div>
          </div>
          <div className="mt-4 text-xs font-mono text-pink-500 group-hover:text-pink-400 transition-colors">
            Get ideas fast →
          </div>
        </button>
      </div>

      {/* Platforms */}
      <div className="flex items-center gap-4 mt-8 text-zinc-700 text-xs font-mono">
        <span>📱 TikTok</span>
        <span>·</span>
        <span>📸 Instagram Reels</span>
      </div>
    </div>
  )
}
