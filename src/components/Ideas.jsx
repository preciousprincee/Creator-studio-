import clsx from 'clsx'
import { RotateCcw } from 'lucide-react'
import { Spinner, Tag, BackButton, SectionHeader, SearchingBadge, WebBadge } from './UI'

const POTENTIAL_COLORS = {
  'High': 'green',
  'Very High': 'amber',
  'Explosive': 'pink',
}

const FORMAT_COLORS = {
  'Face to Camera': 'violet',
  'Text on Screen + Music': 'sky',
  'Voiceover + B-roll': 'orange',
  'Tutorial / How-To': 'green',
  'POV / Skit': 'pink',
  'Trend Participation': 'amber',
}

function IdeaCard({ idea, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(idea)}
      className={clsx(
        'w-full text-left rounded-2xl p-5 border transition-all duration-200',
        selected
          ? 'bg-violet-950/40 border-violet-500/60'
          : 'bg-base-900 border-base-600 hover:border-base-500 hover:bg-base-800'
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl shrink-0">{idea.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className={clsx('font-display font-bold text-[15px] leading-snug', selected ? 'text-violet-300' : 'text-white')}>
              {idea.title}
            </p>
            {idea.trendBased && <WebBadge show />}
          </div>
          <p className="text-zinc-500 text-[13px] leading-relaxed italic">"{idea.hook}"</p>
        </div>
        {selected && (
          <span className="shrink-0 text-[10px] font-mono bg-violet-600 text-white rounded-md px-2 py-0.5">
            SELECTED
          </span>
        )}
      </div>

      {/* Format recommendation */}
      <div className="bg-base-800/80 rounded-xl p-3 mb-3 border border-base-600/60">
        <div className="flex items-center gap-2 mb-1.5">
          <span>{idea.formatIcon}</span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">AI Recommended Format</span>
        </div>
        <p className="text-sm font-display font-semibold text-white mb-1">{idea.format}</p>
        <p className="text-xs text-zinc-500 leading-relaxed">{idea.formatReason}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Tag color={FORMAT_COLORS[idea.format] || 'violet'}>{idea.format}</Tag>
        <Tag color={POTENTIAL_COLORS[idea.potential] || 'green'}>🔥 {idea.potential}</Tag>
      </div>
    </button>
  )
}

export default function Ideas({ ideas, selectedIdea, onSelect, onBack, onRegenerate, onContinue, loading, loadingResearch, searchStatus, webSearchUsed }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-up">
      <BackButton onClick={onBack} />
      <div className="flex items-start justify-between mb-2">
        <SectionHeader label="AI Generated" title="Your Content Ideas" subtitle="Pick one to research and build a script around it." />
        <button onClick={onRegenerate} disabled={loading} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm font-display border border-base-600 hover:border-base-500 rounded-xl px-3 py-2 transition-all shrink-0 mt-1">
          <RotateCcw size={13} /> Redo
        </button>
      </div>

      {/* Search status */}
      {(searchStatus || webSearchUsed) && (
        <div className="mb-4">
          <SearchingBadge status={searchStatus || (webSearchUsed ? 'done' : null)} />
        </div>
      )}

      {loading ? (
        <div className="py-16 flex flex-col items-center gap-3">
          <Spinner text={searchStatus === 'searching' ? 'Searching the web for trends...' : 'Generating ideas...'} />
          {searchStatus === 'searching' && (
            <p className="text-xs text-zinc-600 font-mono">Checking TikTok & Reels trends in real time</p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {ideas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} selected={selectedIdea?.title === idea.title} onSelect={onSelect} />
            ))}
          </div>
          <button onClick={() => onContinue(selectedIdea)} disabled={!selectedIdea || loadingResearch} className="btn-primary w-full py-3.5">
            {loadingResearch ? 'Researching...' : 'Research This Idea →'}
          </button>
        </>
      )}
    </div>
  )
}
