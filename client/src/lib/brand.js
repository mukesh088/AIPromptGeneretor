/** Central brand configuration — replace placeholders when launching. */
export const brand = {
  name: 'Promptora',
  tagline: 'Find a look. Make it yours.',
  description:
    'Discover curated AI prompts for images, video, and everyday work — customize, copy, or create inside the studio.',
  domain: 'promptora.app',
  supportEmail: 'hello@promptora.app',
  logoText: 'Promptora',
  social: {
    twitter: 'https://twitter.com/promptora',
    instagram: 'https://instagram.com/promptora',
    youtube: 'https://youtube.com/@promptora',
  },
  demoMode: true,
}

export const contentTypes = [
  { id: 'image', label: 'Images', path: '/images' },
  { id: 'video', label: 'Videos', path: '/videos' },
  { id: 'work', label: 'Work', path: '/work' },
]

export const sortOptions = [
  { id: 'curated', label: 'Curated' },
  { id: 'newest', label: 'Newest' },
  { id: 'most_copied', label: 'Most copied' },
  { id: 'most_saved', label: 'Most saved' },
]

export const aspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9', '2:3', '3:2']

export const supportedTools = [
  { id: 'midjourney', label: 'Midjourney', url: 'https://www.midjourney.com/' },
  { id: 'chatgpt', label: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/' },
  { id: 'claude', label: 'Claude', url: 'https://claude.ai/' },
  { id: 'runway', label: 'Runway', url: 'https://runwayml.com/' },
  { id: 'kling', label: 'Kling', url: 'https://klingai.com/' },
  { id: 'leonardo', label: 'Leonardo', url: 'https://leonardo.ai/' },
  { id: 'flux', label: 'Flux', url: 'https://fal.ai/' },
]
