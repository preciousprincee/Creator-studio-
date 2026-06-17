import { useState } from 'react'
import { AriaAvatar, AriaSays, SectionCard, PotentialBadge, PriorityBadge, WebBadge, Spinner } from './UI'
import clsx from 'clsx'

const FORMAT_EMOJI = {
  'Face to Camera': '🎤',
  'Text on Screen + Music': '✍️',
  'Voiceover + B-roll': '🎙️',
  'Tutorial / How-To': '📋',
  'POV / Skit': '🎭',
  'Trend Participation': '🔥',
}

const DAY_COLORS = [
  'bg-terra-100 text-terra-700',
  'bg-sage-100 text-sage-700',
  'bg-sand-100 text-sand-700',
  'bg-cream-200 text-ink-600',
  'bg-terra-100 text-terra-700',
  'bg-sage-100 text-sage-700',
  'bg-cream-100 text-ink-500',
]

export default function Dashboard({ profile, strategy, webUsed, onReset, generateScript, loadingSection }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [scriptStates, setScriptStates] = useState({}) // { [ideaTitle]: { loading, script } }
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const tabs = [
    { id: 'overview',  label: 'Overview',  emoji: '✦' },
    { id: 'brand',     label: 'Brand',     emoji: '🎨' },
    { id: 'growth',    label: 'Growth',    emoji: '📈' },
    { id: 'calendar',  label: 'Calendar',  emoji: '📅' },
    { id: 'ideas',     label: 'Ideas',     emoji: '💡' },
    { id: 'tips',      label: 'Tips',      emoji: '⚡' },
  ]

  async function handleGetScript(idea) {
    setScriptStates(s => ({ ...s, [idea.title]: { loading: true, script: null } }))
    const result = await generateScript(idea, profile)
    setScriptStates(s => ({ ...s, [idea.title]: { loading: false, script: result } }))
  }

  // Saved indicator
  const savedAt = (() => {
    try {
      const raw = localStorage.getItem('aria_user_data')
      if (!raw) return null
      const d = JSON.parse(raw)
      if (!d.savedAt) return null
      return new Date(d.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return null }
  })()

  return (
    <div className="min-h-screen bg-warm-gradient">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AriaAvatar size="sm" />
            <div>
              <p className="font-display text-sm text-ink-800 leading-none">Aria</p>
              <p className="text-[10px] text-ink-300 font-mono">
                {profile.name}
                {savedAt && <span className="ml-1">· saved {savedAt}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {webUsed && <WebBadge />}
            {showResetConfirm ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-ink-500">Start over?</span>
                <button onClick={onReset} className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 rounded-xl px-2.5 py-1 transition-colors">Yes</button>
                <button onClick={() => setShowResetConfirm(false)} className="text-xs text-ink-400 hover:text-ink-600 border border-cream-300 rounded-xl px-2.5 py-1 transition-colors">No</button>
              </div>
            ) : (
              <button onClick={() => setShowResetConfirm(true)} className="text-xs text-ink-400 hover:text-ink-600 border border-cream-300 rounded-xl px-3 py-1.5 transition-colors">
                New profile
              </button>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                activeTab === t.id
                  ? 'bg-terra-400 text-white shadow-warm-sm'
                  : 'text-ink-500 hover:text-ink-800 hover:bg-cream-200'
              )}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5 pb-24">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-up space-y-5">
            {/* Aria greeting */}
            <div className="card p-6">
              <AriaSays>{strategy.greeting}</AriaSays>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Platform',  value: profile.platforms.join(' & ') },
                  { label: 'Followers', value: profile.followers },
                  { label: 'Posting',   value: profile.postingFreq?.split(' ').slice(0,2).join(' ') },
                  { label: 'Goal',      value: profile.goal?.split(' ').slice(0, 3).join(' ') + '…' },
                ].map(s => (
                  <div key={s.label} className="bg-cream-50 rounded-2xl p-3 border border-cream-200 text-center">
                    <p className="label-tag mb-1">{s.label}</p>
                    <p className="text-ink-800 text-sm font-semibold leading-snug">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Session restored notice */}
            {savedAt && (
              <div className="flex items-center gap-2.5 bg-sage-50 border border-sage-100 rounded-2xl px-4 py-3">
                <span className="text-sage-500">💾</span>
                <p className="text-sage-700 text-sm">Your strategy was restored from your last session ({savedAt}).</p>
              </div>
            )}

            {/* Nav cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { tab: 'brand',    emoji: '🎨', title: 'Brand Voice',      sub: `${strategy.brandVoice?.pillars?.length || 3} content pillars defined` },
                { tab: 'growth',   emoji: '📈', title: 'Growth Strategy',  sub: `${strategy.growthStrategy?.tactics?.length || 4} tactics ready` },
                { tab: 'calendar', emoji: '📅', title: 'Content Calendar', sub: '7-day plan, ready to go' },
                { tab: 'ideas',    emoji: '💡', title: 'Content Ideas',    sub: `${strategy.contentIdeas?.length || 6} ideas + scripts` },
              ].map(c => (
                <button
                  key={c.tab}
                  onClick={() => setActiveTab(c.tab)}
                  className="card p-5 text-left hover:shadow-warm-lg transition-all active:scale-[0.98] group"
                >
                  <span className="text-2xl mb-2 block">{c.emoji}</span>
                  <p className="font-display text-base text-ink-800 mb-0.5">{c.title}</p>
                  <p className="text-xs text-ink-400 group-hover:text-terra-500 transition-colors">{c.sub}</p>
                </button>
              ))}
            </div>

            {/* Quick wins */}
            <SectionCard icon="⚡" title="This Week's Quick Wins" accent="sage">
              <div className="space-y-3">
                {strategy.performanceTips?.quickWins?.map((w, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-sage-200 text-sage-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">{i + 1}</span>
                    <p className="text-ink-700 text-sm leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Struggle fix highlight */}
            <div className="card p-5 border-terra-200">
              <div className="flex gap-2 items-center mb-3">
                <span className="text-xl">🎯</span>
                <p className="font-display text-base text-ink-900">Fix: {profile.struggle}</p>
              </div>
              <p className="text-ink-600 text-sm leading-relaxed">{strategy.performanceTips?.struggleFix}</p>
              <button onClick={() => setActiveTab('tips')} className="mt-3 text-xs text-terra-500 hover:text-terra-600 font-medium">See all tips →</button>
            </div>
          </div>
        )}

        {/* BRAND VOICE */}
        {activeTab === 'brand' && (
          <div className="animate-fade-up space-y-5">
            <SectionCard icon="🎨" title="Your Brand Voice" subtitle="What makes you, you." accent="terra">
              <div className="mb-5">
                <p className="label-tag mb-2">Your unique angle</p>
                <p className="text-ink-700 text-sm bg-terra-50 rounded-2xl p-4 border border-terra-100 leading-relaxed italic">
                  "{strategy.brandVoice?.uniqueAngle}"
                </p>
              </div>
              <div className="mb-5">
                <p className="label-tag mb-3">Tone of voice</p>
                <div className="flex flex-wrap gap-2">
                  {strategy.brandVoice?.tone?.map(t => (
                    <span key={t} className="bg-sand-100 border border-sand-200 text-sand-600 text-sm rounded-full px-3 py-1.5">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="label-tag mb-2">What to avoid</p>
                <div className="space-y-1.5">
                  {strategy.brandVoice?.avoid?.map(a => (
                    <div key={a} className="flex gap-2 items-start text-sm text-ink-500">
                      <span className="text-terra-300 mt-0.5 shrink-0">✕</span> {a}
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <div>
              <p className="label-tag mb-3 px-1">Your content pillars</p>
              <div className="space-y-3">
                {strategy.brandVoice?.pillars?.map((p, i) => (
                  <div key={i} className="card p-5 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-center text-2xl shrink-0">
                      {p.emoji}
                    </div>
                    <div>
                      <p className="font-display text-base text-ink-900 mb-1">{p.name}</p>
                      <p className="text-ink-500 text-sm leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GROWTH STRATEGY */}
        {activeTab === 'growth' && (
          <div className="animate-fade-up space-y-5">
            <SectionCard icon="📈" title="Your Growth Strategy" accent="sage">
              <p className="text-ink-600 text-sm leading-relaxed mb-5">{strategy.growthStrategy?.summary}</p>
              <div className="space-y-3">
                {strategy.growthStrategy?.tactics?.map((t, i) => (
                  <div key={i} className="bg-cream-50 rounded-2xl p-4 border border-cream-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-display text-base text-ink-800">{t.title}</p>
                      <PriorityBadge level={t.priority} />
                    </div>
                    <p className="text-ink-500 text-sm leading-relaxed mb-2">{t.description}</p>
                    <p className="text-[11px] font-mono text-ink-300">⏱ {t.timeframe}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon="⏰" title="Posting Schedule" accent="sand">
              <div className="mb-4">
                <p className="label-tag mb-2">Recommended frequency</p>
                <p className="text-ink-700 text-sm bg-sand-50 rounded-xl p-3 border border-sand-100 leading-relaxed">{strategy.growthStrategy?.postingSchedule?.frequency}</p>
              </div>
              <div className="mb-4">
                <p className="label-tag mb-2">Best times to post</p>
                <div className="space-y-2">
                  {strategy.growthStrategy?.postingSchedule?.bestTimes?.map((t, i) => (
                    <div key={i} className="flex gap-2 text-sm text-ink-600">
                      <span className="text-terra-400 shrink-0">→</span> {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-sage-50 rounded-xl p-3 border border-sage-100">
                <p className="label-tag mb-1 text-sage-600">Consistency tip</p>
                <p className="text-ink-600 text-sm leading-relaxed">{strategy.growthStrategy?.postingSchedule?.consistency}</p>
              </div>
            </SectionCard>
          </div>
        )}

        {/* CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="animate-fade-up space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <h2 className="font-display text-xl text-ink-900">Weekly Content Calendar</h2>
              <span className="label-tag">7-day plan</span>
            </div>
            {strategy.calendar?.map((day, i) => (
              <div key={day.day} className={clsx('card p-5', day.day === 'Sunday' && 'opacity-70')}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono shrink-0', DAY_COLORS[i])}>
                    {day.day.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base text-ink-900">{day.day}</p>
                    <p className="text-xs text-ink-400 truncate">{day.theme}</p>
                  </div>
                  {day.format && day.format !== 'optional' && (
                    <span className="text-xl shrink-0">{FORMAT_EMOJI[day.format] || '📹'}</span>
                  )}
                </div>
                {day.idea && (
                  <>
                    <p className="text-ink-700 text-sm font-medium mb-1.5 leading-snug">{day.idea}</p>
                    {day.hook && <p className="text-ink-400 text-xs italic mb-3">"{day.hook}"</p>}
                    {day.caption && (
                      <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
                        <p className="label-tag mb-1">Caption tip</p>
                        <p className="text-ink-500 text-xs leading-relaxed">{day.caption}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* IDEAS */}
        {activeTab === 'ideas' && (
          <div className="animate-fade-up space-y-4">
            <div className="px-1 mb-2">
              <h2 className="font-display text-xl text-ink-900">Content Ideas</h2>
              <p className="text-ink-400 text-sm mt-0.5">Tap "Get script" on any idea to generate a full script.</p>
            </div>
            {strategy.contentIdeas?.map((idea, i) => {
              const state = scriptStates[idea.title] || {}
              return (
                <div key={i} className="card p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl shrink-0">{idea.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base text-ink-900 mb-1 leading-snug">{idea.title}</p>
                      <p className="text-ink-400 text-sm italic leading-relaxed">"{idea.hook}"</p>
                    </div>
                    <PotentialBadge level={idea.potential} />
                  </div>

                  <div className="bg-cream-50 rounded-xl p-3 border border-cream-200 mb-3">
                    <p className="label-tag mb-1">Why this works for you</p>
                    <p className="text-ink-600 text-xs leading-relaxed">{idea.why}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-300">{FORMAT_EMOJI[idea.format] || '📹'} {idea.format}</span>
                    <button
                      onClick={() => handleGetScript(idea)}
                      disabled={state.loading}
                      className="btn-primary py-2 px-4 text-xs disabled:opacity-50"
                    >
                      {state.loading ? 'Writing…' : state.script ? 'Regenerate ↺' : 'Get script →'}
                    </button>
                  </div>

                  {/* Script panel */}
                  {(state.loading || state.script) && (
                    <div className="mt-4 border-t border-cream-200 pt-4">
                      {state.loading
                        ? <div className="flex justify-center py-3"><Spinner text="Writing your script…" size="sm" /></div>
                        : state.script && <ScriptView script={state.script} />
                      }
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* TIPS */}
        {activeTab === 'tips' && (
          <div className="animate-fade-up space-y-5">
            <SectionCard icon="🎯" title="Fix Your Biggest Struggle" subtitle={profile.struggle} accent="terra">
              <p className="text-ink-700 text-sm leading-relaxed bg-terra-50 rounded-2xl p-4 border border-terra-100">
                {strategy.performanceTips?.struggleFix}
              </p>
            </SectionCard>

            <SectionCard icon="🚀" title="Level Up Advice" subtitle={`For creators at ${profile.followers} followers`} accent="sage">
              <p className="text-ink-700 text-sm leading-relaxed">{strategy.performanceTips?.levelUpTip}</p>
            </SectionCard>

            <SectionCard icon="📊" title="Metrics to Track" accent="sand">
              <div className="space-y-3">
                {strategy.performanceTips?.metrics?.map((m, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-sand-100 border border-sand-200 flex items-center justify-center text-xs text-sand-600 font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-ink-600 text-sm leading-relaxed">{m}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon="⚡" title="Quick Wins This Week" accent="cream">
              <div className="space-y-3">
                {strategy.performanceTips?.quickWins?.map((w, i) => (
                  <div key={i} className="flex gap-3 items-start bg-cream-50 rounded-2xl p-3.5 border border-cream-200">
                    <span className="w-5 h-5 rounded-full bg-terra-200 text-terra-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-ink-700 text-sm leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

      </main>
    </div>
  )
}

function ScriptView({ script }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(
      `HOOK:\n${script.hook}\n\nBODY:\n${script.body?.join('\n')}\n\nCTA:\n${script.cta}\n\nTIP: ${script.tip}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <p className="label-tag text-terra-500">✍️ Your Script · <span className="font-mono">{script.duration}</span></p>
      <div className="rounded-xl p-3.5 border border-terra-200 bg-terra-50">
        <p className="label-tag mb-1.5 text-terra-500">Hook — first 3s</p>
        <p className="text-ink-800 text-sm font-medium leading-relaxed">{script.hook}</p>
      </div>
      <div className="rounded-xl p-3.5 border border-cream-200 bg-cream-50">
        <p className="label-tag mb-2">Body</p>
        {script.body?.map((pt, i) => (
          <div key={i} className="flex gap-2 text-sm text-ink-600 mb-2 last:mb-0">
            <span className="text-ink-300 shrink-0 font-mono">{i + 1}.</span>
            <span className="leading-relaxed">{pt}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3.5 border border-sage-200 bg-sage-50">
        <p className="label-tag mb-1.5 text-sage-600">CTA</p>
        <p className="text-ink-700 text-sm font-medium leading-relaxed">{script.cta}</p>
      </div>
      {script.tip && (
        <div className="rounded-xl p-3 border border-sand-200 bg-sand-50">
          <p className="label-tag mb-1 text-sand-500">Delivery tip</p>
          <p className="text-ink-500 text-xs leading-relaxed">{script.tip}</p>
        </div>
      )}
      <button onClick={copy} className="btn-primary w-full py-2.5 text-xs">
        {copied ? '✓ Copied!' : '📋 Copy full script'}
      </button>
    </div>
  )
}
