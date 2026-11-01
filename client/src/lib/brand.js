/** Central brand configuration — replace placeholders when launching. */
export const brand = {
  name: 'Promptora',
  tagline: 'Free AI Photo Prompts',
  description:
    'Browse AI photo prompts by category and collection — copy a look, paste into ChatGPT with your photo, and make it yours.',
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

/** Audience / theme tags used for filtering and admin assignment */
export const filterTags = [
  { id: 'boys', label: 'Boys' },
  { id: 'girls', label: 'Girls' },
  { id: 'couple', label: 'Couple' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'festival', label: 'Festival' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'aesthetic', label: 'Aesthetic' },
  { id: 'selfie', label: 'Selfie' },
  { id: 'travel', label: 'Travel' },
  { id: 'horror', label: 'Horror' },
  { id: 'cartoon', label: 'Cartoon' },
  { id: 'templates', label: 'Templates' },
  { id: 'portrait', label: 'Portrait' },
]

/** Home chip menus (promptpin.in-style) — filter by tag */
export const homeTabs = [
  { id: 'all', label: 'All', path: '/' },
  { id: 'boys', label: 'Boys', path: '/?tag=boys' },
  { id: 'girls', label: 'Girls', path: '/?tag=girls' },
  { id: 'couple', label: 'Couple', path: '/?tag=couple' },
  { id: 'templates', label: 'Templates', path: '/templates' },
]

export const sortOptions = [
  { id: 'curated', label: 'Curated' },
  { id: 'newest', label: 'Newest' },
  { id: 'most_copied', label: 'Most copied' },
  { id: 'most_saved', label: 'Most saved' },
]

export const aspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9', '2:3', '3:2']

/** Top image-generation AI platforms shown as selectable badges in admin */
export const supportedTools = [
  { id: 'chatgpt', label: 'ChatGPT', url: 'https://chatgpt.com/' },
  { id: 'gemini', label: 'Gemini', url: 'https://gemini.google.com/' },
  { id: 'midjourney', label: 'Midjourney', url: 'https://www.midjourney.com/' },
  { id: 'claude', label: 'Claude', url: 'https://claude.ai/' },
  { id: 'leonardo', label: 'Leonardo', url: 'https://leonardo.ai/' },
  { id: 'flux', label: 'Flux', url: 'https://fal.ai/' },
  { id: 'ideogram', label: 'Ideogram', url: 'https://ideogram.ai/' },
  { id: 'firefly', label: 'Adobe Firefly', url: 'https://firefly.adobe.com/' },
  { id: 'grok', label: 'Grok', url: 'https://grok.x.ai/' },
  { id: 'stable-diffusion', label: 'Stable Diffusion', url: 'https://stability.ai/' },
]
