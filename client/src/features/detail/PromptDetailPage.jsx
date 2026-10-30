import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Copy, Flag, Share2, Sparkles } from 'lucide-react'
import { usePrompt, useRelated, useCategories } from '@/hooks/usePrompts'
import { PreviewMedia } from '@/components/media/PreviewMedia'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { VariableForm, defaultsFromVariables } from './VariableForm'
import { PromptCard } from '@/components/gallery/PromptCard'
import { copyText, shareOrCopyLink, resolvePrompt, hasUnresolvedRequired } from '@/lib/copy'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { useUiStore } from '@/stores/uiStore'
import { useToast } from '@/components/ui/Toast'
import { promptRepository } from '@/repositories'
import { supportedTools } from '@/lib/brand'
import { cn } from '@/lib/cn'

export function PromptDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: prompt, isLoading } = usePrompt(slug)
  const { data: related = [] } = useRelated(prompt)
  const { data: categories = [] } = useCategories()
  const toast = useToast()
  const instructionLang = useUiStore((s) => s.instructionLang)
  const setInstructionLang = useUiStore((s) => s.setInstructionLang)
  const isSaved = useBookmarkStore((s) => (prompt ? s.isSaved(prompt.id) : false))
  const toggle = useBookmarkStore((s) => s.toggle)
  const [values, setValues] = useState({})
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (prompt) {
      setValues(defaultsFromVariables(prompt.variables || []))
      promptRepository.recordEvent('view', prompt.id)
    }
  }, [prompt?.id])

  const finalPrompt = useMemo(
    () => (prompt ? resolvePrompt(prompt.promptTemplate, values) : ''),
    [prompt, values],
  )

  if (isLoading) {
    return <div className="animate-pulse p-4"><div className="aspect-[3/4] max-w-lg rounded-[var(--radius-card)] bg-[var(--surface-2)]" /></div>
  }

  if (!prompt) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-display text-xl font-semibold">Prompt not found</p>
        <Button className="mt-4" onClick={() => navigate('/')}>Back to Explore</Button>
      </div>
    )
  }

  const category = categories.find((c) => c.id === prompt.categoryId)
  const steps = prompt.usageSteps?.[instructionLang] || prompt.usageSteps?.en || []
  const tips = prompt.tips?.[instructionLang] || prompt.tips?.en || []

  const onCopy = async () => {
    const missing = hasUnresolvedRequired(prompt.promptTemplate, values, prompt.variables)
    if (missing.length) {
      toast.error(`Fill required fields: ${missing.join(', ')}`)
      return
    }
    const result = await copyText(finalPrompt)
    if (result.ok) {
      promptRepository.recordEvent('copy', prompt.id)
      toast.success('Final prompt copied')
    } else toast.error(result.error || 'Copy failed')
  }

  const onShare = async () => {
    const url = window.location.href
    const result = await shareOrCopyLink({
      title: prompt.title,
      text: prompt.shortDescription,
      url,
    })
    if (result.aborted) return
    if (result.ok) toast.success(result.method === 'share' ? 'Shared' : 'Link copied')
    else toast.error('Share failed')
  }

  const openTool = (toolId) => {
    const tool = supportedTools.find((t) => t.id === toolId)
    if (tool?.url) window.open(tool.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="md:grid md:grid-cols-2 md:gap-8 md:px-6 md:pt-6">
      <div className="relative">
        <div className="sticky top-14 z-10 flex items-center gap-2 bg-[var(--bg)]/90 px-3 py-2 backdrop-blur md:static md:bg-transparent md:px-0">
          <Button variant="ghost" size="icon" aria-label="Back" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <nav className="truncate text-xs text-[var(--muted)]" aria-label="Breadcrumb">
            <Link to="/">Explore</Link>
            {category && (
              <>
                {' / '}
                <Link to={`/category/${category.slug}`}>{category.name}</Link>
              </>
            )}
            {' / '}
            <span className="text-[var(--fg)]">{prompt.title}</span>
          </nav>
        </div>
        <div className="px-3 md:px-0">
          <PreviewMedia
            preview={prompt.preview}
            title={prompt.title}
            badge={prompt.badge}
            typeLabel={prompt.contentType}
            className="w-full"
          />
          <p className="mt-2 text-xs text-[var(--muted)]">{prompt.attribution}</p>
        </div>
      </div>

      <div className="space-y-5 px-3 pb-28 pt-4 md:pb-8 md:pt-0">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge tone="type">{prompt.contentType}</Badge>
            {prompt.badge && <Badge tone={prompt.badge}>{prompt.badge}</Badge>}
            {prompt.requiresReferenceImage && <Badge>Needs reference</Badge>}
          </div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{prompt.title}</h1>
          <p className="mt-2 text-[var(--muted)]">{prompt.shortDescription}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
            {prompt.tags.map((t) => (
              <span key={t} className="rounded-full bg-[var(--surface-2)] px-2 py-1">
                #{t}
              </span>
            ))}
          </div>
        </div>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Customize</h2>
          </div>
          <VariableForm
            variables={prompt.variables}
            values={values}
            onChange={setValues}
            onReset={() => setValues(defaultsFromVariables(prompt.variables || []))}
          />
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">Final prompt</h2>
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-3">
            <pre
              className={cn(
                'whitespace-pre-wrap font-sans text-sm leading-relaxed',
                !expanded && 'line-clamp-6',
              )}
            >
              {finalPrompt}
            </pre>
            <button
              type="button"
              className="mt-2 text-sm font-semibold text-[var(--accent)]"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
          {prompt.negativePrompt && (
            <div className="mt-3">
              <h3 className="mb-1 text-sm font-semibold">Negative prompt</h3>
              <p className="text-sm text-[var(--muted)]">{prompt.negativePrompt}</p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">How to use</h2>
            <div className="flex rounded-full bg-[var(--surface-2)] p-0.5 text-xs font-semibold">
              {['en', 'hi'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={cn(
                    'rounded-full px-3 py-1.5 uppercase',
                    instructionLang === lang && 'bg-[var(--accent)] text-white',
                  )}
                  onClick={() => setInstructionLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--muted)]">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {tips.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
              {tips.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-[var(--muted)]">
            Instruction language does not change the prompt text itself.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">Open in tool</h2>
          <div className="flex flex-wrap gap-2">
            {prompt.supportedTools.map((id) => {
              const tool = supportedTools.find((t) => t.id === id)
              return (
                <Button key={id} variant="outline" size="sm" onClick={() => openTool(id)}>
                  Open {tool?.label || id}
                </Button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Opens the official site only — your prompt is not transferred automatically. Copy first.
          </p>
        </section>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)]"
          onClick={() => toast.info('Report received (demo) — moderation arrives in Phase 2.')}
        >
          <Flag className="h-4 w-4" /> Report content
        </button>

        {related.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-lg font-semibold">Related</h2>
            <div className="masonry !columns-2">
              {related.slice(0, 4).map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div
        className="fixed inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--bg)]/95 px-3 py-2 backdrop-blur md:static md:col-span-2 md:mt-2 md:border-0 md:bg-transparent md:p-0"
        style={{ bottom: 'calc(var(--bottom-nav-h) + var(--safe-bottom))' }}
      >
        <div className="mx-auto flex max-w-[1440px] gap-2 md:justify-end">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Save"
            onClick={() => {
              const saved = toggle(prompt.id)
              if (saved) promptRepository.recordEvent('save', prompt.id)
              toast.success(saved ? 'Saved on this device' : 'Removed')
            }}
          >
            <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
          </Button>
          <Button variant="secondary" size="icon" aria-label="Share" onClick={onShare}>
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="secondary" className="flex-1 md:flex-none" onClick={onCopy}>
            <Copy className="h-4 w-4" /> Copy prompt
          </Button>
          <Button
            variant="gradient"
            className="flex-1 md:flex-none"
            onClick={() => navigate(`/create?from=${prompt.slug}`)}
          >
            <Sparkles className="h-4 w-4" /> Customize / Create
          </Button>
        </div>
      </div>
    </div>
  )
}
