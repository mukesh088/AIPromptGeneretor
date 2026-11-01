import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePrompt } from '@/hooks/usePrompts'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { VariableForm, defaultsFromVariables } from '@/features/detail/VariableForm'
import { providersForTask, sampleOutputs } from '@/lib/providers'
import { resolvePrompt, hasUnresolvedRequired, copyText } from '@/lib/copy'
import { useHistoryStore } from '@/stores/historyStore'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

const modes = [
  { id: 'text-to-image', label: 'Text → Image', output: 'image' },
  { id: 'image-to-image', label: 'Image → Image', output: 'image' },
  { id: 'text-to-video', label: 'Text → Video', output: 'video' },
  { id: 'image-to-video', label: 'Image → Video', output: 'video' },
  { id: 'text-generation', label: 'Work / Text', output: 'work' },
]

export function StudioPage() {
  const [params] = useSearchParams()
  const from = params.get('from')
  const { data: seedPrompt } = usePrompt(from)
  const toast = useToast()
  const navigate = useNavigate()
  const addJob = useHistoryStore((s) => s.addJob)
  const updateJob = useHistoryStore((s) => s.updateJob)
  const submitting = useRef(false)

  const [mode, setMode] = useState('text-to-image')
  const [promptText, setPromptText] = useState('')
  const [variables, setVariables] = useState([])
  const [values, setValues] = useState({})
  const [providerId, setProviderId] = useState('')
  const [ratio, setRatio] = useState('3:4')
  const [duration, setDuration] = useState('5 seconds')
  const [imageCount, setImageCount] = useState(1)
  const [advanced, setAdvanced] = useState(false)
  const [refPreview, setRefPreview] = useState(null)
  const [status, setStatus] = useState('idle')
  const [outputs, setOutputs] = useState([])
  const [jobId, setJobId] = useState(null)

  const availableProviders = useMemo(() => providersForTask(mode), [mode])
  const provider = availableProviders.find((p) => p.id === providerId) || availableProviders[0]
  const modeMeta = modes.find((m) => m.id === mode)

  useEffect(() => {
    if (availableProviders.length) setProviderId(availableProviders[0].id)
  }, [mode])

  useEffect(() => {
    if (!seedPrompt) return
    setPromptText(seedPrompt.promptTemplate)
    setVariables(seedPrompt.variables || [])
    setValues(defaultsFromVariables(seedPrompt.variables || []))
    if (seedPrompt.contentType === 'video') setMode('text-to-video')
    else if (seedPrompt.contentType === 'work') setMode('text-generation')
    else setMode('text-to-image')
    if (seedPrompt.supportedAspectRatios?.[0]) setRatio(seedPrompt.supportedAspectRatios[0])
  }, [seedPrompt?.id])

  const finalPrompt = useMemo(
    () => resolvePrompt(promptText, values),
    [promptText, values],
  )

  const onFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Max 20MB uploads')
      return
    }
    const url = URL.createObjectURL(file)
    setRefPreview({ name: file.name, url })
  }

  const runDemo = async () => {
    if (submitting.current) return
    const missing = hasUnresolvedRequired(promptText, values, variables)
    if (missing.length) {
      toast.error(`Fill required fields: ${missing.join(', ')}`)
      return
    }
    if (!provider?.configured) {
      toast.error('Selected provider is unconfigured')
      return
    }
    if (provider.uploadRequiredFor?.includes(mode) && !refPreview) {
      toast.error('Reference image required for this mode')
      return
    }

    submitting.current = true
    const id = `job_${Date.now()}`
    setJobId(id)
    setOutputs([])
    setStatus('validating')
    const job = {
      id,
      mode,
      providerId: provider.id,
      prompt: finalPrompt,
      ratio,
      duration,
      status: 'validating',
      demo: true,
      createdAt: new Date().toISOString(),
      outputs: [],
    }
    addJob(job)

    await wait(300)
    setStatus('queued')
    updateJob(id, { status: 'queued' })
    await wait(700)
    setStatus('processing')
    updateJob(id, { status: 'processing' })
    await wait(1200)

    const samples = sampleOutputs[modeMeta.output] || sampleOutputs.image
    setOutputs(samples)
    setStatus('succeeded')
    updateJob(id, { status: 'succeeded', outputs: samples })
    toast.info('Demo simulation finished — outputs are sample previews, not generated from your prompt.')
    submitting.current = false
  }

  return (
    <div className="px-3 py-4 sm:px-4 md:grid md:grid-cols-2 md:gap-8 md:px-6 md:py-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-2xl font-bold">Creation studio</h1>
          <Badge tone="demo">Demo mode</Badge>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Explore the layout and customize prompts. Live providers stay unconfigured until Phase 3.
        </p>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                'shrink-0 rounded-full px-3 py-2 text-sm font-semibold',
                mode === m.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-2)] text-[var(--muted)]',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div>
          <Label htmlFor="provider">Provider / model</Label>
          <select
            id="provider"
            className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
            value={provider?.id || ''}
            onChange={(e) => setProviderId(e.target.value)}
          >
            {availableProviders.map((p) => (
              <option key={p.id} value={p.id} disabled={!p.configured}>
                {p.name}
                {p.demo ? ' (demo)' : ''}
                {!p.configured ? ' — unconfigured' : ''}
              </option>
            ))}
          </select>
        </div>

        {variables.length > 0 && (
          <VariableForm
            variables={variables}
            values={values}
            onChange={setValues}
            onReset={() => setValues(defaultsFromVariables(variables))}
          />
        )}

        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            value={variables.length ? finalPrompt : promptText}
            onChange={(e) => {
              if (!variables.length) setPromptText(e.target.value)
            }}
            readOnly={variables.length > 0}
            className={variables.length ? 'opacity-90' : ''}
          />
          {variables.length > 0 && (
            <p className="mt-1 text-xs text-[var(--muted)]">Edit fields above to update the resolved prompt.</p>
          )}
        </div>

        {(mode.includes('image-to') || provider?.uploadRequiredFor?.includes(mode)) && (
          <div>
            <Label>Reference image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            {refPreview && (
              <div className="mt-2 flex items-center gap-3">
                <img src={refPreview.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div>
                  <p className="text-sm">{refPreview.name}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      URL.revokeObjectURL(refPreview.url)
                      setRefPreview(null)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {provider?.ratios && (
          <div>
            <Label htmlFor="ratio">Aspect ratio</Label>
            <select
              id="ratio"
              className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
            >
              {provider.ratios.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}

        {provider?.durations && mode.includes('video') && (
          <div>
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              {provider.durations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          className="text-sm font-semibold text-[var(--accent)]"
          onClick={() => setAdvanced((a) => !a)}
        >
          {advanced ? 'Hide advanced' : 'Advanced controls'}
        </button>
        {advanced && provider?.maxImages && (
          <div>
            <Label htmlFor="count">Image count</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={provider.maxImages}
              value={imageCount}
              onChange={(e) => setImageCount(Number(e.target.value))}
            />
          </div>
        )}

        <Button
          variant="gradient"
          className="w-full"
          disabled={status === 'queued' || status === 'processing' || status === 'validating'}
          onClick={runDemo}
        >
          {status === 'idle' || status === 'succeeded' || status === 'failed'
            ? 'Run demo generation'
            : status === 'validating'
              ? 'Validating…'
              : status === 'queued'
                ? 'Queued (demo)…'
                : 'Processing (demo)…'}
        </Button>
        <p className="text-xs text-[var(--muted)]">
          Demo jobs are simulations. Sample outputs are never claimed as generations from your prompt.
        </p>
      </div>

      <div className="mt-8 space-y-4 md:mt-0">
        <h2 className="font-display text-lg font-semibold">Results</h2>
        <div
          className="flex aspect-[3/4] max-h-[520px] items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--border)] bg-[var(--surface)] p-4"
          style={{ aspectRatio: ratio.replace(':', ' / ') }}
        >
          {status === 'idle' && (
            <p className="text-center text-sm text-[var(--muted)]">Output preview appears here</p>
          )}
          {(status === 'queued' || status === 'processing' || status === 'validating') && (
            <p className="text-center text-sm">
              {status === 'validating' && 'Validating request…'}
              {status === 'queued' && 'Job queued in demo simulator…'}
              {status === 'processing' && 'Processing demo job…'}
              <span className="mt-2 block text-xs text-[var(--muted)]">Honest status — no fake percentages.</span>
            </p>
          )}
          {status === 'succeeded' && outputs[0] && (
            <OutputCard output={outputs[0]} />
          )}
        </div>

        {outputs.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {outputs.map((o) => (
              <button key={o.id} type="button" className="text-left" onClick={() => setOutputs([o, ...outputs.filter((x) => x.id !== o.id)])}>
                <OutputCard output={o} compact />
              </button>
            ))}
          </div>
        )}

        {status === 'succeeded' && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => copyText(finalPrompt).then(() => toast.success('Prompt copied'))}>
              Reuse prompt
            </Button>
            <Button variant="secondary" onClick={runDemo}>
              Regenerate (demo)
            </Button>
            <Button variant="outline" onClick={() => navigate('/history')}>
              View history
            </Button>
          </div>
        )}
        {jobId && (
          <p className="text-xs text-[var(--muted)]">Demo job id: {jobId}</p>
        )}
      </div>
    </div>
  )
}

function OutputCard({ output, compact }) {
  if (output.kind === 'text') {
    return (
      <div className={cn('w-full rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-2)] p-3', !compact && 'h-full')}>
        <Badge tone="demo" className="mb-2 normal-case">Sample preview</Badge>
        <pre className="whitespace-pre-wrap font-sans text-sm">{output.text}</pre>
        <p className="mt-2 text-xs text-[var(--muted)]">{output.note}</p>
      </div>
    )
  }
  return (
    <div className={cn('relative w-full overflow-hidden rounded-[var(--radius-card)]', output.gradient, compact ? 'aspect-square' : 'h-full min-h-[200px]')}>
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        <Badge tone="demo" className="w-fit normal-case">Sample preview</Badge>
        <div>
          <p className="font-display font-semibold text-white">{output.label}</p>
          {!compact && <p className="mt-1 text-xs text-white/80">{output.note}</p>}
        </div>
      </div>
    </div>
  )
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
