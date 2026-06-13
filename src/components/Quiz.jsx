import { useState } from 'react'
import { BackButton, SectionHeader, ErrorBanner } from './UI'
import clsx from 'clsx'

const NICHES = [
  'Comedy & Entertainment', 'Beauty & Fashion', 'Fitness & Health',
  'Food & Cooking', 'Finance & Business', 'Education & How-To',
  'Lifestyle & Vlog', 'Tech & Gaming', 'Travel', 'Motivation & Mindset',
  'Relationships & Dating', 'Parenting', 'Music & Arts', 'Sports',
]

const GOALS = [
  'Grow followers fast', 'Build a personal brand', 'Make money / monetize',
  'Educate my audience', 'Go viral', 'Just have fun',
]

export default function Quiz({ onBack, onSubmit, loading, error, onClearError }) {
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal] = useState('')

  const canSubmit = niche && goal

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-up">
      <BackButton onClick={onBack} />
      <SectionHeader
        label="Step 1 of 1"
        title="Tell us about yourself"
        subtitle="Answer 3 quick questions and we'll generate tailored ideas."
      />

      {error && <div className="mb-4"><ErrorBanner message={error} onDismiss={onClearError} /></div>}

      <div className="space-y-6">
        {/* Niche */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-3">Your niche *</p>
          <div className="flex flex-wrap gap-2">
            {NICHES.map(n => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={clsx(
                  'text-sm font-body px-3 py-1.5 rounded-full border transition-all duration-150',
                  niche === n
                    ? 'bg-violet-600/30 border-violet-500 text-violet-300'
                    : 'bg-base-800 border-base-600 text-zinc-400 hover:border-base-500 hover:text-zinc-300'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">Target audience <span className="normal-case tracking-normal text-zinc-700">(optional)</span></p>
          <input
            value={audience}
            onChange={e => setAudience(e.target.value)}
            placeholder="e.g. Women 25–35 who want to lose weight without going to the gym"
            className="w-full bg-base-800 border border-base-600 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
          />
        </div>

        {/* Goal */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-3">Your main goal *</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={clsx(
                  'text-sm font-body px-3 py-1.5 rounded-full border transition-all duration-150',
                  goal === g
                    ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                    : 'bg-base-800 border-base-600 text-zinc-400 hover:border-base-500 hover:text-zinc-300'
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSubmit({ niche, audience: audience || 'general audience', goal })}
          disabled={!canSubmit || loading}
          className="btn-primary w-full py-3.5"
        >
          {loading ? 'Generating Ideas...' : 'Generate My Content Ideas →'}
        </button>
      </div>
    </div>
  )
}
