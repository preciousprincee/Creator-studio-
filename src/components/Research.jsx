import { Spinner, BackButton, Tag } from './UI'
import clsx from 'clsx'

const SECTIONS = [
  { key: 'trending', icon: '📈', label: 'Trending Topics', color: 'pink', textColor: 'text-pink-400' },
  { key: 'sounds', icon: '🎵', label: 'Sounds to Use', color: 'sky', textColor: 'text-sky-400' },
  { key: 'hooks', icon: '🪝', label: 'Hook Variations', color: 'violet', textColor: 'text-violet-400' },
  { key: 'postTips', icon: '📅', label: 'Posting Tips', color: 'green', textColor: 'text-emerald-400' },
  { key: 'competitorAngles', icon: '🎯', label: 'Competitor Angles', color: 'orange', textColor: 'text-orange-400' },
]

function ResearchCard({ icon, label, textColor, items }) {
  return (
    <div className="bg-base-900 border border-base-600 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span>{icon}</span>
        <p className={clsx('font-display font-bold text-sm', textColor)}>{label}</p>
      </div>
      <div className="space-y-2.5">
        {items?.map((item, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <span className={clsx('font-mono text-xs mt-0.5 shrink-0', textColor)}>→</span>
            <p className="text-zinc-300 text-sm leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Research({
  idea, research, script, onBack, onGenerateScript,
  loading, loadingScript
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-up">
      <BackButton onClick={onBack} />

      {/* Selected idea recap */}
      <div className="bg-base-900 border border-violet-600/40 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{idea.icon}</span>
          <div>
            <p className="font-display font-bold text-white text-base mb-1">{idea.title}</p>
            <p className="text-violet-400 text-sm italic mb-3">"{idea.hook}"</p>
            <div className="flex gap-2 flex-wrap">
              <Tag color="violet">{idea.formatIcon} {idea.format}</Tag>
              <Tag color="green">🔥 {idea.potential}</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* Research */}
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-4">Content Research</p>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner text="Researching trends..." />
        </div>
      ) : research ? (
        <>
          <div className="space-y-3 mb-6">
            {SECTIONS.map(s => (
              <ResearchCard key={s.key} {...s} items={research[s.key]} />
            ))}
          </div>

          {/* Script section */}
          <div className="border-t border-base-600 pt-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2">Script Generator</p>
            <p className="text-zinc-500 text-sm mb-4">
              Get a Hook → Body → CTA script tailored for this idea and format.
            </p>

            {!script && (
              <button
                onClick={onGenerateScript}
                disabled={loadingScript}
                className="btn-primary w-full py-3.5"
              >
                {loadingScript ? 'Writing script...' : '✍️ Generate Script'}
              </button>
            )}

            {loadingScript && (
              <div className="py-6 flex justify-center">
                <Spinner text="Writing your script..." />
              </div>
            )}

            {script && <ScriptCard script={script} onRegenerate={onGenerateScript} />}
          </div>
        </>
      ) : null}
    </div>
  )
}

function ScriptCard({ script, onRegenerate }) {
  function copyScript() {
    const text = [
      `HOOK:\n${script.hook}`,
      `\nBODY:\n${script.body.join('\n')}`,
      `\nCTA:\n${script.cta}`,
      `\n⏱ ${script.duration} · ${script.deliveryTip}`,
    ].join('\n')
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-base-900 border border-emerald-800/40 rounded-2xl p-5 animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <p className="font-display font-bold text-emerald-400">✍️ Your Script</p>
        <p className="text-xs font-mono text-zinc-600">⏱ {script.duration}</p>
      </div>

      {/* Hook */}
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-pink-500 mb-2">Hook — First 3s</p>
        <div className="bg-base-800 border border-pink-800/30 rounded-xl p-3.5">
          <p className="text-white text-sm leading-relaxed font-medium">{script.hook}</p>
        </div>
      </div>

      {/* Body */}
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-sky-500 mb-2">Body</p>
        <div className="space-y-2">
          {script.body?.map((point, i) => (
            <div key={i} className="bg-base-800 border border-base-600 rounded-xl p-3.5 flex gap-3">
              <span className="text-zinc-600 font-mono text-xs mt-0.5 shrink-0">{i + 1}.</span>
              <p className="text-zinc-200 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mb-5">
        <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 mb-2">CTA</p>
        <div className="bg-base-800 border border-emerald-800/30 rounded-xl p-3.5">
          <p className="text-white text-sm leading-relaxed font-medium">{script.cta}</p>
        </div>
      </div>

      {/* Delivery tip */}
      {script.deliveryTip && (
        <div className="bg-amber-950/30 border border-amber-800/30 rounded-xl p-3 mb-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600 mb-1">Delivery Tip</p>
          <p className="text-amber-200/80 text-xs leading-relaxed">{script.deliveryTip}</p>
        </div>
      )}

      <div className="flex gap-2.5">
        <button onClick={onRegenerate} className="btn-ghost flex-1 py-2.5 text-sm">
          ↺ Redo
        </button>
        <button onClick={copyScript} className="btn-primary flex-1 py-2.5 text-sm">
          📋 Copy Script
        </button>
      </div>
    </div>
  )
}
