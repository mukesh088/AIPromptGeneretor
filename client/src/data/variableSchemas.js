export const variableCatalog = {
  subject: { key: 'subject', label: 'Subject', type: 'text', required: true, default: 'a young woman', help: 'Who or what is the main focus?' },
  outfit: { key: 'outfit', label: 'Outfit', type: 'text', required: true, default: 'embroidered silk lehenga', help: 'Clothing and accessories.' },
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

export function vars(...keys) {
  return keys.map((key) => {
    const base = variableCatalog[key]
    if (!base) throw new Error(`Unknown variable: ${key}`)
    return { ...base }
  })
}
