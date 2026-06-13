import { useState } from 'react'
import { BackButton, SectionHeader, ErrorBanner } from './UI'
import clsx from 'clsx'

const NICHE_TAGS = [
  'Beauty', 'Fitness', 'Finance', 'Food', 'Comedy', 'Tech',
  'Travel', 'Music', 'Gaming', 'Fashion', 'Education', 'Lifestyle',
  'Motivation', 'Parenting', 'Sports', 'Art & Design',
]

export default function Describe({ onBack, onSubmit, loading, error, onClearError }) {
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [description, setDescription] = useState('')

  const activeNiche = niche === 'custom' ? customNiche : niche
  const canSubmit = activeNiche.trim().length > 0 && description.trim().length > 20

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-up">
      <BackButton onClick={onBack} />
      <SectionHeader
        label="Quick start"
        title="Describe your niche"
        subtitle="Tell us what you create — we'll generate fresh ideas you haven't thought of yet."
      />

      {error && <div className="mb-4"><ErrorBanner message={error} onDismiss={onClearError} /></div>}

      <div className="space-y-5">
        {/* Niche tag picker */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-3">Your niche *</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {NICHE_TAGS.map(n => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={clsx(
                  'text-sm px-3 py-1.5 rounded-full border transition-all duration-150',
                  niche === n
                    ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                    : 'bg-base-800 border-base-600 text-zinc-400 hover:border-base-500 hover:text-zinc-300'
                )}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setNiche('custom')}
              className={clsx(
                'text-sm px-3 py-1.5 rounded-full border transition-all duration-150',
                niche === 'custom'
                  ? 'bg-pink-600/20 border-pink-500 text-pink-300'
                  : 'bg-base-800 border-base-600 text-zinc-400 hover:border-base-500 hover:text-zinc-300'
              )}
            >
              + Other
            </button>
          </div>

          {niche === 'custom' && (
            <input
              value={customNiche}
              onChange={e => setCustomNiche(e.target.value)}
              placeholder="e.g. Thrift flipping, Urban farming, ASMR cooking..."
              autoFocus
              className="w-full bg-base-800 border border-pink-600/40 focus:border-pink-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
            />
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">
            What do you already create? *
          </p>
          <p className="text-zinc-600 text-xs mb-3">
            Be specific — the more detail, the better the ideas. What's working? What's your style? Who do you reach?
          </p>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. I post fitness content for busy moms. My best videos are quick 30-second workouts that need no equipment. I've done abs, glutes, and arms. My audience loves the 'no gym needed' angle but I'm running out of ideas on what to show next..."
            rows={5}
            className="w-full bg-base-800 border border-base-600 focus:border-violet-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors resize-none leading-relaxed"
          />
          <p className={clsx(
            'text-right text-xs mt-1 font-mono transition-colors',
            description.length > 20 ? 'text-emerald-600' : 'text-zinc-700'
          )}>
            {description.length} chars
          </p>
        </div>

        <button
          onClick={() => onSubmit({ niche: activeNiche, description })}
          disabled={!canSubmit || loading}
          className="btn-primary w-full py-3.5"
        >
          {loading ? 'Finding Ideas...' : 'Get Fresh Content Ideas →'}
        </button>
      </div>
    </div>
  )
}
