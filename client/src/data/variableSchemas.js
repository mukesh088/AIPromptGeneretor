export const variableCatalog = {
  name: {
    key: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    default: '',
    help: 'Enter a name',
    placeholder: 'e.g. Priya',
  },
  age: {
    key: 'age',
    label: 'Age',
    type: 'text',
    required: false,
    default: '',
    help: 'Optional age',
    placeholder: 'e.g. 24',
  },
  city: {
    key: 'city',
    label: 'City',
    type: 'text',
    required: false,
    default: '',
    help: 'City or place name',
    placeholder: 'e.g. Mumbai',
  },
  subject: { key: 'subject', label: 'Subject', type: 'text', required: true, default: 'a young woman', help: 'Who or what is the main focus?' },
  outfit: { key: 'outfit', label: 'Outfit', type: 'text', required: true, default: 'embroidered silk lehenga', help: 'Clothing and accessories.', placeholder: 'e.g. red saree' },
  location: { key: 'location', label: 'Location', type: 'text', required: true, default: 'heritage courtyard at dusk', help: 'Setting or backdrop.' },
  lighting: { key: 'lighting', label: 'Lighting', type: 'select', required: true, default: 'golden hour rim light', options: ['golden hour rim light', 'soft window light', 'neon night glow', 'studio softbox', 'candlelit warm'], help: 'Primary lighting mood.' },
  style: { key: 'style', label: 'Style', type: 'text', required: true, default: 'cinematic editorial photography', help: 'Visual or writing style.' },
  aspect_ratio: { key: 'aspect_ratio', label: 'Aspect ratio', type: 'select', required: false, default: '3:4', options: ['1:1', '3:4', '4:3', '9:16', '16:9', '2:3', '3:2'] },
  language: { key: 'language', label: 'Language', type: 'select', required: false, default: 'English', options: ['English', 'Hindi', 'Hinglish'] },
  duration: { key: 'duration', label: 'Duration', type: 'select', required: false, default: '5 seconds', options: ['3 seconds', '5 seconds', '8 seconds', '10 seconds'] },
  camera_motion: { key: 'camera_motion', label: 'Camera motion', type: 'select', required: false, default: 'slow push-in', options: ['slow push-in', 'orbit left', 'crane up', 'handheld drift', 'static locked'] },
  tone: { key: 'tone', label: 'Tone', type: 'select', required: false, default: 'warm and clear', options: ['warm and clear', 'formal', 'playful', 'concise', 'storytelling'] },
  audience: { key: 'audience', label: 'Audience', type: 'text', required: false, default: 'general readers' },
  topic: { key: 'topic', label: 'Topic', type: 'text', required: true, default: 'product launch' },
  product: { key: 'product', label: 'Product', type: 'text', required: true, default: 'ceramic coffee mug' },
  brand: { key: 'brand', label: 'Brand voice', type: 'text', required: false, default: 'friendly and premium' },
}

/** Fields admins can enable per prompt (shown as inputs on selected cards). */
export const personalizeFields = [
  { key: 'name', label: 'Name', defaultHint: 'Enter her/his name' },
  { key: 'age', label: 'Age', defaultHint: 'e.g. 24' },
  { key: 'city', label: 'City', defaultHint: 'e.g. Mumbai' },
  { key: 'outfit', label: 'Outfit', defaultHint: 'e.g. red saree' },
]

export function buildPersonalizeVariable(key, hint) {
  const base = variableCatalog[key]
  if (!base) return null
  const field = personalizeFields.find((f) => f.key === key)
  return {
    ...base,
    help: hint || field?.defaultHint || base.help || '',
    placeholder: hint || field?.defaultHint || base.placeholder || base.label,
    default: '',
  }
}

export function vars(...keys) {
  return keys.map((key) => {
    const base = variableCatalog[key]
    if (!base) throw new Error(`Unknown variable: ${key}`)
    return { ...base }
  })
}
