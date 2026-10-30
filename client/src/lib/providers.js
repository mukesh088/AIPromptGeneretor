/** Capability registry — demo adapter only in Phase 1. */
export const providers = [
  {
    id: 'demo-image',
    name: 'Demo Image',
    tasks: ['text-to-image', 'image-to-image'],
    configured: true,
    demo: true,
    ratios: ['1:1', '3:4', '4:3', '9:16', '16:9'],
    sizes: ['1024', '1536'],
    maxImages: 4,
    async: true,
    uploadRequiredFor: ['image-to-image'],
  },
  {
    id: 'demo-video',
    name: 'Demo Video',
    tasks: ['text-to-video', 'image-to-video'],
    configured: true,
    demo: true,
    ratios: ['9:16', '16:9', '1:1'],
    durations: ['3 seconds', '5 seconds', '8 seconds'],
    async: true,
    uploadRequiredFor: ['image-to-video'],
  },
  {
    id: 'demo-text',
    name: 'Demo Text',
    tasks: ['text-generation'],
    configured: true,
    demo: true,
    async: false,
  },
  {
    id: 'live-image-unconfigured',
    name: 'Live Image Provider',
    tasks: ['text-to-image'],
    configured: false,
    demo: false,
    note: 'Connect a verified image API in Phase 3.',
  },
]

export function providersForTask(task) {
  return providers.filter((p) => p.tasks.includes(task))
}

export const sampleOutputs = {
  image: [
    {
      id: 'sample-img-1',
      kind: 'gradient',
      gradient: 'preview-gradient-1',
      label: 'Sample preview A',
      note: 'Preloaded sample — not generated from your prompt.',
    },
    {
      id: 'sample-img-2',
      kind: 'gradient',
      gradient: 'preview-gradient-2',
      label: 'Sample preview B',
      note: 'Preloaded sample — not generated from your prompt.',
    },
  ],
  video: [
    {
      id: 'sample-vid-1',
      kind: 'gradient',
      gradient: 'preview-gradient-3',
      label: 'Sample motion still',
      note: 'Demo simulation still — not a rendered video.',
    },
  ],
  work: [
    {
      id: 'sample-work-1',
      kind: 'text',
      label: 'Sample outline',
      text: '1. Hook\n2. Context\n3. Three key points\n4. Call to action\n\n(This is a demo sample output, not generated from your prompt.)',
      note: 'Preloaded sample — not generated from your prompt.',
    },
  ],
}
