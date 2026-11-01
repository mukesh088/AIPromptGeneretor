/** Prompt catalog aligned to promptpin.in public titles/themes.
 * Preview images: free Unsplash License photos (local after seed download).
 * Prompt body text is original — not copied from the reference site.
 */
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

function p(partial) {
  const promptTemplate = partial.promptTemplate || partial.promptText || ''
  const gradient = partial.previewGradient || 'preview-gradient-1'
  const url = partial.imageUrl || null
  const copies = partial.copies || 0
  const saves = partial.saves || 0
  const likes = partial.likes || 0
  const { promptText, imageUrl, previewGradient, likes: _l, ...rest } = partial
  const catSlugHints = (partial.categoryIds || [])
    .concat(partial.categoryId ? [partial.categoryId] : [])
    .map((id) => String(id).replace(/^cat_/, '').replace(/_/g, '-'))
  const tags = [...new Set([...(partial.tags || []), ...catSlugHints])]
  return {
    contentType: 'image',
    language: 'en',
    status: 'published',
    featured: true,
    variables: [],
    supportedTools: ['chatgpt', 'gemini', 'midjourney'],
    requiresReferenceImage: true,
    supportedAspectRatios: ['4:5', '3:4', '1:1'],
    shortDescription: 'Copy this photo prompt and paste it into ChatGPT with your own photo.',
    usageSteps: {
      en: [
        'Tap Copy prompt to copy the full text.',
        'Open ChatGPT and start a new chat.',
        'Upload the photo you want to transform.',
        'Paste the prompt and send it.',
        'Regenerate once or twice if needed.',
      ],
      hi: [],
    },
    tips: { en: [], hi: [] },
    attribution: 'Illustrative Unsplash License preview. Replace in Admin.',
    publishedAt: '2026-10-01T10:00:00.000Z',
    createdAt: '2026-10-01T10:00:00.000Z',
    ...rest,
    tags,
    promptTemplate,
    preview: {
      url,
      alt: partial.title,
      width: 800,
      height: 1000,
      gradient,
      kind: url ? 'image' : 'gradient',
      format: 'illustrative',
    },
    demoMetrics: { views: likes, copies, saves },
    metrics: { views: likes, copies, saves, likes },
  }
}

export const prompts = [
  p({ id: 'p001', slug: 'diwali-saree-night-girls', title: 'Diwali Saree Night Glow — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_festival','cat_festive_days'], tags: ['diwali','saree','girls'], likes: 420, saves: 180, copies: 290,
    imageUrl: img('photo-1604608672950-c4f63d8c6d9a'), previewGradient: 'preview-gradient-1',
    promptText: `Transform the uploaded photo into a festive Diwali night portrait of a young woman.
Keep her exact face, skin tone, and identity. Dress her in an elegant silk saree with soft zari borders.
Scene: rooftop or courtyard at night with warm diyas, fairy lights, and distant fireworks bokeh.
Lighting: warm golden key light from diyas, soft rim light on hair, gentle cinematic contrast.
Camera: portrait 4:5, eye-level, shallow depth of field, natural skin texture, no beauty filters.
Mood: graceful, festive, Instagram-ready. No text, no watermark, no extra people.` }),

  p({ id: 'p002', slug: 'diwali-lehenga-balcony-girls', title: 'Diwali Lehenga Balcony — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_festival'], tags: ['diwali','lehenga'], likes: 380, saves: 150, copies: 240,
    imageUrl: img('photo-1610030469983-98e550d6193c'), previewGradient: 'preview-gradient-2',
    promptText: `Restyle the uploaded photo as a Diwali balcony portrait.
Preserve identity. Outfit: richly embroidered lehenga in jewel tones with subtle jewelry.
Background: decorated balcony with hanging lanterns and soft night city glow.
Lighting: warm tungsten + diya glow, cinematic color grade, creamy bokeh.
Framing: 4:5 portrait, mid-shot. Clean skin texture, no plastic look. No text or logos.` }),

  p({ id: 'p003', slug: 'diwali-mirror-selfie-girls', title: 'Diwali Mirror Selfie Aesthetic — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_selfie','cat_aesthetic'], tags: ['diwali','selfie'], likes: 510, saves: 220, copies: 360,
    imageUrl: img('photo-1515886657613-9f3515b0c78f'), previewGradient: 'preview-gradient-3',
    promptText: `Convert the uploaded photo into an aesthetic Diwali mirror selfie.
Keep face identical. Soft festive makeup, elegant ethnic top or saree blouse.
Scene: bedroom mirror with string lights and diya reflections, phone lightly visible or natural pose.
Lighting: soft indoor warm light, aesthetic grain, gentle vignette.
Aspect 4:5. No text, no watermark.` }),

  p({ id: 'p004', slug: 'diwali-couple-rooftop', title: 'Diwali Couple Rooftop Portrait', categoryId: 'cat_couple', categoryIds: ['cat_couple','cat_festival'], tags: ['diwali','couple'], likes: 610, saves: 280, copies: 410,
    imageUrl: img('photo-1522673607200-164d1b6ce486'), previewGradient: 'preview-gradient-4',
    promptText: `Create a romantic Diwali couple portrait from the uploaded photo(s).
Preserve both faces accurately. Traditional festive Indian outfits coordinated in warm colors.
Scene: decorated rooftop at night, diyas lining the floor, soft fireworks in distant sky.
Pose: standing close, natural smile, flattering mid-shot.
Lighting: warm cinematic glow, soft fill, film-like color grade. 4:5. No text.` }),

  p({ id: 'p005', slug: 'diwali-rangoli-pose-girls', title: 'Diwali Rangoli Courtyard — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_festival'], tags: ['diwali','rangoli'], likes: 290, saves: 110, copies: 180,
    imageUrl: img('photo-1604608672950-c4f63d8c6d9a'), previewGradient: 'preview-gradient-5',
    promptText: `Restyle as a Diwali courtyard portrait beside a colorful rangoli.
Keep identity. Festive ethnic wear, light jewelry.
Natural evening light mixed with diya warmth. Soft cinematic look, 4:5 portrait.
No text, no watermark, realistic fabric detail.` }),

  p({ id: 'p006', slug: 'diwali-kurta-boys', title: 'Diwali Kurta Night — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_festival'], tags: ['diwali','boys'], likes: 340, saves: 140, copies: 210,
    imageUrl: img('photo-1506794778202-cad84cf45f1d'), previewGradient: 'preview-gradient-6',
    promptText: `Transform into a sharp Diwali night portrait for a young man.
Keep exact face. Outfit: stylish embroidered kurta or sherwani in deep festive colors.
Background: festive street or courtyard with warm lights and soft bokeh.
Confident pose, cinematic lighting, 4:5. Natural skin, no text.` }),

  p({ id: 'p007', slug: 'diwali-terrace-boys', title: 'Diwali Terrace Look — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_festival'], tags: ['diwali','terrace'], likes: 270, saves: 95, copies: 160,
    imageUrl: img('photo-1500648767791-00dcc994a43e'), previewGradient: 'preview-gradient-1',
    promptText: `Create a Diwali terrace portrait. Preserve identity.
Casual ethnic kurta, neat grooming. Warm diya lighting, soft night sky.
Mid-shot, cinematic grade, 4:5. No logos or text.` }),

  p({ id: 'p008', slug: 'diwali-street-lights-boys', title: 'Diwali Street Lights — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_cinematic'], tags: ['diwali','street'], likes: 255, saves: 88, copies: 145,
    imageUrl: img('photo-1492562080023-ab3db95bfbce'), previewGradient: 'preview-gradient-2',
    promptText: `Cinematic Diwali street portrait for boys. Exact face preserved.
Stylish festive casuals. Background: lit Indian street market at night.
Moody warm highlights, soft shadows, film still vibe. 4:5. No text.` }),

  p({ id: 'p009', slug: 'diwali-minimal-boys', title: 'Minimal Diwali Portrait — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_portrait'], tags: ['diwali','minimal'], likes: 198, saves: 70, copies: 120,
    imageUrl: img('photo-1539571696357-5a69c17a67c6'), previewGradient: 'preview-gradient-3',
    promptText: `Clean minimal Diwali portrait. Keep face identical.
Simple cream or ivory kurta, soft studio-like festive backdrop with subtle diya accents.
Soft key light, gentle falloff, modern editorial look. 4:5. No text.` }),

  p({ id: 'p010', slug: 'diwali-family-festive', title: 'Festive Family Diwali Glow', categoryId: 'cat_festival', categoryIds: ['cat_festival','cat_festive_days'], tags: ['diwali','family'], likes: 220, saves: 90, copies: 130,
    imageUrl: img('photo-1511895426328-dc8714191300'), previewGradient: 'preview-gradient-4',
    promptText: `Warm festive Diwali indoor portrait mood. Preserve identity of subjects.
Ethnic wear, decorated living space with diyas and marigold accents.
Soft ambient tungsten light, cozy cinematic grade. 4:5. No text.` }),

  p({ id: 'p011', slug: 'casino-royale-couple', title: 'Casino Royale Cinematic — Couple', categoryId: 'cat_couple', categoryIds: ['cat_couple','cat_cinematic'], tags: ['couple','cinematic'], likes: 480, saves: 210, copies: 330,
    imageUrl: img('photo-1516589178581-6cd7833ae3b2'), previewGradient: 'preview-gradient-5',
    promptText: `Restyle as a luxurious cinematic couple portrait inspired by classic spy-film glamour.
Preserve both faces. Elegant evening wear — tuxedo and evening dress, refined styling.
Scene: upscale lounge with soft amber practical lights and shallow depth of field.
Camera: portrait 4:5, cinematic color grade, film grain subtle. No text or watermark.` }),

  p({ id: 'p012', slug: 'sunset-couple-portrait', title: 'Golden Hour Couple Portrait', categoryId: 'cat_couple', categoryIds: ['cat_couple','cat_portrait'], tags: ['couple','sunset'], likes: 350, saves: 160, copies: 240,
    imageUrl: img('photo-1518199266791-5375a83190b7'), previewGradient: 'preview-gradient-6',
    promptText: `Golden-hour couple portrait. Exact faces preserved.
Soft casual outfits, outdoor terrace or park. Warm backlight, lens flare subtle, romantic mood.
4:5 framing, natural skin. No text.` }),

  p({ id: 'p013', slug: 'monsoon-cafe-couple', title: 'Monsoon Cafe Couple', categoryId: 'cat_couple', categoryIds: ['cat_couple','cat_aesthetic'], tags: ['couple','cafe'], likes: 310, saves: 140, copies: 200,
    imageUrl: img('photo-1529636798458-92182e662485'), previewGradient: 'preview-gradient-1',
    promptText: `Aesthetic monsoon cafe couple scene. Preserve identities.
Sitting by a rain-streaked window, soft warm interior light vs cool rainy exterior.
Cinematic color grade, cozy mood, 4:5. No text.` }),

  p({ id: 'p014', slug: 'aesthetic-cafe-girls', title: 'Aesthetic Cafe Photo Prompt for Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_cinematic','cat_aesthetic'], tags: ['cafe','cinematic','girls'], likes: 720, saves: 340, copies: 510,
    imageUrl: img('photo-1529626455594-4ff0802cfb7e'), previewGradient: 'preview-gradient-2',
    promptText: `Turn the uploaded photo into a polished cinematic cafe portrait for girls.
Keep exact face and identity. Casual chic outfit suitable for a cozy cafe.
Scene: indoor cafe with natural daylight from a large window, soft bokeh, wooden tones.
Lighting: natural daylight key, gentle fill, cinematic finish.
Camera: portrait 4:5, eye-level, shallow DOF, natural skin texture.
No text, no watermark, no plastic skin.` }),

  p({ id: 'p015', slug: 'words-of-the-heart-girls', title: 'Words of the Heart Cinematic — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_cinematic'], tags: ['cinematic','girls'], likes: 390, saves: 170, copies: 250,
    imageUrl: img('photo-1494790108377-be9c29b29330'), previewGradient: 'preview-gradient-3',
    promptText: `Emotional cinematic portrait for girls. Preserve face.
Soft wardrobe in muted tones, quiet indoor corner with books or handwritten notes soft in background.
Moody window light, film still grading, subtle grain. 4:5. No text overlays.` }),

  p({ id: 'p016', slug: 'bold-horizon-girls', title: 'Bold Horizon Cinematic — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_cinematic','cat_travel'], tags: ['horizon','girls'], likes: 360, saves: 155, copies: 230,
    imageUrl: img('photo-1487412720507-e7ab37603c6f'), previewGradient: 'preview-gradient-4',
    promptText: `Bold outdoor cinematic portrait at a wide horizon. Exact identity kept.
Wind-soft hair, confident stance, travel-ready outfit.
Golden or blue-hour sky, dramatic but flattering light, 4:5. No text.` }),

  p({ id: 'p017', slug: 'honey-fire-girls', title: 'Honey & Fire Cinematic — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_cinematic'], tags: ['warm','cinematic'], likes: 410, saves: 190, copies: 280,
    imageUrl: img('photo-1534528741775-53994a69daeb'), previewGradient: 'preview-gradient-5',
    promptText: `Warm honey-and-fire cinematic portrait. Preserve face.
Amber practical lights, soft smoke or haze optional, rich warm grade.
Elegant outfit, mid-shot, 4:5, natural skin. No text.` }),

  p({ id: 'p018', slug: 'urban-street-boys', title: 'Urban Street Style — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_portrait'], tags: ['street','boys'], likes: 300, saves: 120, copies: 190,
    imageUrl: img('photo-1507003211169-0a1dd7228f2d'), previewGradient: 'preview-gradient-6',
    promptText: `Modern urban street portrait for boys. Keep face exact.
Smart casual or streetwear. City sidewalk, soft daylight, editorial look.
4:5, shallow DOF. No text.` }),

  p({ id: 'p019', slug: 'car-night-boys', title: 'Night Car Portrait — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_cinematic'], tags: ['car','boys'], likes: 540, saves: 250, copies: 380,
    imageUrl: img('photo-1492144534655-ae79c964c9d7'), previewGradient: 'preview-gradient-1',
    promptText: `Cinematic night car portrait for boys. Preserve identity.
Leaning on or seated in a stylish car, city neon reflections on paint and face.
Cool-warm contrast lighting, filmic grade, 4:5. No logos or text.` }),

  p({ id: 'p020', slug: 'car-sunset-boys', title: 'Sunset Car Look — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_travel'], tags: ['car','sunset'], likes: 320, saves: 130, copies: 200,
    imageUrl: img('photo-1503376780353-7e6692767b70'), previewGradient: 'preview-gradient-2',
    promptText: `Golden-hour car portrait for boys. Exact face.
Open road or parking overlook, warm sunset rim light on subject and vehicle.
Confident pose, cinematic 4:5. No text.` }),

  p({ id: 'p021', slug: 'rakhi-sibling-portrait', title: 'Raksha Bandhan Sibling Portrait', categoryId: 'cat_festive_days', categoryIds: ['cat_festive_days','cat_festival'], tags: ['rakhi'], likes: 280, saves: 110, copies: 170,
    imageUrl: img('photo-1604608672950-c4f63d8c6d9a'), previewGradient: 'preview-gradient-3',
    promptText: `Warm Raksha Bandhan portrait. Preserve identities.
Festive traditional outfits, soft indoor or courtyard setting with rakhi details visible naturally.
Soft daylight, joyful mood, 4:5. No text.` }),

  p({ id: 'p022', slug: 'rakhi-festive-girls', title: 'Rakhi Festive Look — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_festive_days'], tags: ['rakhi','girls'], likes: 240, saves: 95, copies: 150,
    imageUrl: img('photo-1594744803329-e58b31de8bf5'), previewGradient: 'preview-gradient-4',
    promptText: `Elegant Rakhi-day festive portrait for girls. Keep face.
Bright ethnic wear, soft smile, marigold accents in background.
Natural light, clean aesthetic grade, 4:5. No text.` }),

  p({ id: 'p023', slug: '1980s-retro-girls', title: '1980s Retro Film Look — Girls', categoryId: 'cat_aesthetic', categoryIds: ['cat_aesthetic','cat_girls'], tags: ['1980s','retro'], likes: 360, saves: 160, copies: 240,
    imageUrl: img('photo-1469334031218-e382a71b716b'), previewGradient: 'preview-gradient-5',
    promptText: `1980s retro film portrait for girls. Preserve identity.
Vintage fashion cues, soft flash look or film grain, muted pastel or warm print grade.
Studio or simple backdrop. 4:5. No modern logos or text.` }),

  p({ id: 'p024', slug: '1980s-retro-boys', title: '1980s Retro Film Look — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_aesthetic'], tags: ['1980s','boys'], likes: 290, saves: 120, copies: 180,
    imageUrl: img('photo-1488161628813-04466f872be2'), previewGradient: 'preview-gradient-6',
    promptText: `1980s retro portrait for boys. Exact face.
Vintage casual styling, analog film grain, soft vignette, nostalgic color cast.
4:5. No text.` }),

  p({ id: 'p025', slug: 'ganesh-chaturthi-devotional', title: 'Ganesh Chaturthi Devotional Portrait', categoryId: 'cat_festival', categoryIds: ['cat_festival','cat_festive_days'], tags: ['ganesh'], likes: 310, saves: 140, copies: 200,
    imageUrl: img('photo-1567593810070-7a3d471af022'), previewGradient: 'preview-gradient-1',
    promptText: `Respectful Ganesh Chaturthi festive portrait. Preserve identity.
Traditional festive attire, soft marigold and lamp accents, serene mood.
Warm indoor light, tasteful composition, 4:5. No text, no disrespectful elements.` }),

  p({ id: 'p026', slug: 'ganesh-festive-girls', title: 'Ganesh Festive Look — Girls', categoryId: 'cat_girls', categoryIds: ['cat_girls','cat_festival'], tags: ['ganesh','girls'], likes: 260, saves: 100, copies: 160,
    imageUrl: img('photo-1604608672950-c4f63d8c6d9a'), previewGradient: 'preview-gradient-2',
    promptText: `Festive Ganesh Chaturthi portrait for girls. Keep face.
Elegant ethnic wear, soft flower decorations, warm lamp glow.
Cinematic soft grade, 4:5. No text.` }),

  p({ id: 'p027', slug: 'birthday-cake-girls', title: 'Birthday Cake Portrait — Girls', categoryId: 'cat_birthday', categoryIds: ['cat_birthday','cat_girls'], tags: ['birthday'], likes: 400, saves: 180, copies: 270,
    imageUrl: img('photo-1464349095431-e9a21285b5f3'), previewGradient: 'preview-gradient-3',
    promptText: `Birthday celebration portrait for girls. Preserve identity.
Festive outfit, birthday cake with soft candle glow, party lights bokeh.
Joyful expression, warm cinematic light, 4:5. No text or watermark.` }),

  p({ id: 'p028', slug: 'birthday-party-boys', title: 'Birthday Party Look — Boys', categoryId: 'cat_birthday', categoryIds: ['cat_birthday','cat_boys'], tags: ['birthday','boys'], likes: 270, saves: 100, copies: 155,
    imageUrl: img('photo-1530103862676-de8c9debad1d'), previewGradient: 'preview-gradient-4',
    promptText: `Birthday party portrait for boys. Exact face.
Smart casual party wear, soft fairy lights, subtle cake or balloons in background.
Warm flattering light, 4:5. No text.` }),

  p({ id: 'p029', slug: 'birthday-couple', title: 'Birthday Couple Celebration', categoryId: 'cat_birthday', categoryIds: ['cat_birthday','cat_couple'], tags: ['birthday','couple'], likes: 330, saves: 145, copies: 210,
    imageUrl: img('photo-1464366400600-7168b8af9bc3'), previewGradient: 'preview-gradient-5',
    promptText: `Romantic birthday couple portrait. Preserve both faces.
Celebration outfits, soft cake candle light and bokeh.
Intimate mid-shot, cinematic grade, 4:5. No text.` }),

  p({ id: 'p030', slug: 'scarlet-reflections-girls', title: 'Scarlet Reflections Cinematic — Girls', categoryId: 'cat_cinematic', categoryIds: ['cat_cinematic','cat_girls'], tags: ['scarlet','cinematic'], likes: 370, saves: 165, copies: 245,
    imageUrl: img('photo-1524504388940-b1c1722653e1'), previewGradient: 'preview-gradient-6',
    promptText: `Scarlet-toned cinematic portrait for girls. Keep identity.
Rich red accents in wardrobe or reflections, moody indoor lighting.
Film grade, soft grain, 4:5. No text.` }),

  p({ id: 'p031', slug: 'midnight-minimal-girls', title: 'Midnight Minimal Cinematic — Girls', categoryId: 'cat_cinematic', categoryIds: ['cat_cinematic','cat_girls'], tags: ['minimal','night'], likes: 355, saves: 150, copies: 230,
    imageUrl: img('photo-1517841905240-472988babdf9'), previewGradient: 'preview-gradient-1',
    promptText: `Midnight minimal cinematic portrait. Preserve face.
Simple dark wardrobe, clean negative space, soft practical light.
Cool-neutral grade, elegant stillness, 4:5. No text.` }),

  p({ id: 'p032', slug: 'car-drive-mood-boys', title: 'Drive Mood Car Portrait — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys'], tags: ['car'], likes: 290, saves: 115, copies: 175,
    imageUrl: img('photo-1549317661-bd32c8ce0db2'), previewGradient: 'preview-gradient-2',
    promptText: `Moody driver-seat portrait for boys. Exact face.
Night or dusk interior car light, city blur through windows.
Cinematic contrast, 4:5. No brand logos or text.` }),

  p({ id: 'p033', slug: 'navratri-garba-girls', title: 'Navratri Garba Night — Girls', categoryId: 'cat_festival', categoryIds: ['cat_festival','cat_girls'], tags: ['navratri','garba'], likes: 450, saves: 200, copies: 320,
    imageUrl: img('photo-1604608672950-c4f63d8c6d9a'), previewGradient: 'preview-gradient-3',
    promptText: `Vibrant Navratri garba-night portrait for girls. Keep face.
Colorful chaniya choli, festive jewelry, soft dance-floor lights and dandiya bokeh.
Joyful energy, warm cinematic grade, 4:5. No text.` }),

  p({ id: 'p034', slug: 'navratri-festive-boys', title: 'Navratri Festive — Boys', categoryId: 'cat_boys', categoryIds: ['cat_boys','cat_festival'], tags: ['navratri','boys'], likes: 280, saves: 105, copies: 165,
    imageUrl: img('photo-1506794778202-cad84cf45f1d'), previewGradient: 'preview-gradient-4',
    promptText: `Navratri festive portrait for boys. Preserve identity.
Stylish kediyu or festive kurta, colorful night celebration lights.
Confident pose, cinematic look, 4:5. No text.` }),

  p({ id: 'p035', slug: 'viral-template-collage', title: 'Viral Collage Template Look', categoryId: 'cat_templates', categoryIds: ['cat_templates','cat_collage'], tags: ['template','collage'], likes: 500, saves: 230, copies: 360,
    imageUrl: img('photo-1558618666-fcd25c85f82e'), previewGradient: 'preview-gradient-5',
    promptText: `Create a trendy multi-frame collage style portrait from the uploaded photo.
Preserve identity across frames. Clean grid or soft overlapping frames, cohesive color grade.
Modern social-template aesthetic, 4:5 overall. No text, no watermarks.` }),

  p({ id: 'p036', slug: 'vn-style-cinematic-cut', title: 'VN-Style Cinematic Still', categoryId: 'cat_templates', categoryIds: ['cat_templates','cat_cinematic'], tags: ['vn','template'], likes: 340, saves: 150, copies: 220,
    imageUrl: img('photo-1485846234645-a62644f84728'), previewGradient: 'preview-gradient-6',
    promptText: `Produce a single cinematic still that feels like a viral short-video thumbnail.
Preserve face. Dramatic lighting, clean composition, subtle motion blur optional in background only.
4:5, high contrast cinematic grade. No UI overlays or text.` }),

  p({ id: 'p037', slug: 'capcut-trend-portrait', title: 'CapCut Trend Portrait Style', categoryId: 'cat_templates', categoryIds: ['cat_templates'], tags: ['capcut','trend'], likes: 420, saves: 190, copies: 300,
    imageUrl: img('photo-1529626455594-4ff0802cfb7e'), previewGradient: 'preview-gradient-1',
    promptText: `Trend-style portrait suitable for CapCut edits. Exact identity.
Clean background separation, punchy color, flattering beauty light without plastic skin.
4:5 vertical. No text, stickers, or watermarks.` }),

  p({ id: 'p038', slug: 'anime-cartoon-transform', title: 'Cartoon & Anime Transform', categoryId: 'cat_cartoon', categoryIds: ['cat_cartoon','cat_templates'], tags: ['anime','cartoon'], likes: 610, saves: 280, copies: 440,
    imageUrl: img('photo-1578632767115-351597cf2477'), previewGradient: 'preview-gradient-2',
    promptText: `Stylize the uploaded photo into a polished anime/cartoon portrait.
Keep recognizable facial identity and hairstyle cues. Clean linework, soft cel shading, vibrant but natural palette.
Portrait 4:5. No text, no logos.` }),

  p({ id: 'p039', slug: 'travel-mountain-portrait', title: 'Travel Mountain Portrait', categoryId: 'cat_travel', categoryIds: ['cat_travel','cat_portrait'], tags: ['travel'], likes: 300, saves: 125, copies: 185,
    imageUrl: img('photo-1464822759023-fed622ff2c3b'), previewGradient: 'preview-gradient-3',
    promptText: `Travel portrait with mountain vista. Preserve face.
Outdoor adventure-casual outfit, soft daylight, scenic depth.
4:5. No text.` }),

  p({ id: 'p040', slug: 'horror-cinematic-boys', title: 'Horror Photo Prompt — Boys', categoryId: 'cat_horror', categoryIds: ['cat_horror','cat_boys','cat_cinematic'], tags: ['horror'], likes: 380, saves: 170, copies: 255,
    imageUrl: img('photo-1509248961158-e54f6934749c'), previewGradient: 'preview-gradient-4',
    promptText: `Dark cinematic horror-mood portrait for boys. Keep exact face.
Moody shadows, cool sidelight, eerie but tasteful atmosphere — no gore.
Film grain, 4:5. No text.` }),

  p({ id: 'p041', slug: 'wedding-bridal-portrait', title: 'Wedding Bridal Portrait', categoryId: 'cat_wedding', categoryIds: ['cat_wedding','cat_girls'], tags: ['wedding'], likes: 520, saves: 240, copies: 370,
    imageUrl: img('photo-1519741497674-611481863552'), previewGradient: 'preview-gradient-5',
    promptText: `Elegant bridal portrait. Preserve identity.
Bridal attire and soft jewelry, romantic floral or soft studio backdrop.
Dreamy soft light, refined color grade, 4:5. No text.` }),

  p({ id: 'p042', slug: 'wedding-couple-portrait', title: 'Wedding Couple Portrait', categoryId: 'cat_wedding', categoryIds: ['cat_wedding','cat_couple'], tags: ['wedding','couple'], likes: 560, saves: 260, copies: 400,
    imageUrl: img('photo-1511285560929-80b456fea0bc'), previewGradient: 'preview-gradient-6',
    promptText: `Romantic wedding couple portrait. Exact faces.
Bridal and groom attire, soft outdoor or mandap-adjacent ambiance.
Flattering cinematic light, 4:5. No text.` }),

  p({ id: 'p043', slug: 'selfie-golden-hour-girls', title: 'Golden Hour Selfie — Girls', categoryId: 'cat_selfie', categoryIds: ['cat_selfie','cat_girls'], tags: ['selfie'], likes: 340, saves: 145, copies: 215,
    imageUrl: img('photo-1438761681033-6461ffad8d80'), previewGradient: 'preview-gradient-1',
    promptText: `Natural golden-hour selfie style portrait. Keep face.
Soft outdoor light, flattering close framing, subtle aesthetic grade.
4:5. No text.` }),

  p({ id: 'p044', slug: 'collage-memory-wall', title: 'Memory Wall Collage Prompt', categoryId: 'cat_collage', categoryIds: ['cat_collage'], tags: ['collage'], likes: 250, saves: 100, copies: 155,
    imageUrl: img('photo-1452587925148-ce544e77e70d'), previewGradient: 'preview-gradient-2',
    promptText: `Build a tasteful photo-collage composition featuring the subject.
Preserve identity. Soft paper or digital collage layout, cohesive tones.
Overall 4:5. No text labels.` }),

  p({ id: 'p045', slug: 'portrait-studio-clean', title: 'Clean Studio Portrait', categoryId: 'cat_portrait', categoryIds: ['cat_portrait'], tags: ['studio'], likes: 280, saves: 110, copies: 170,
    imageUrl: img('photo-1531746020798-e6953c6e8e04'), previewGradient: 'preview-gradient-3',
    promptText: `Clean professional studio portrait. Exact face.
Simple backdrop, soft beauty lighting, natural skin detail.
4:5. No text.` }),

  p({ id: 'p046', slug: 'aesthetic-pastel-girls', title: 'Pastel Aesthetic — Girls', categoryId: 'cat_aesthetic', categoryIds: ['cat_aesthetic','cat_girls'], tags: ['pastel','aesthetic'], likes: 390, saves: 175, copies: 260,
    imageUrl: img('photo-1524504388940-b1c1722653e1'), previewGradient: 'preview-gradient-4',
    promptText: `Soft pastel aesthetic portrait for girls. Preserve identity.
Pastel wardrobe, airy background, dreamy but clear facial detail.
4:5. No text.` }),

  p({ id: 'p047', slug: 'festive-days-general', title: 'Festive Day Celebration Portrait', categoryId: 'cat_festive_days', categoryIds: ['cat_festive_days','cat_festival'], tags: ['festive'], likes: 210, saves: 80, copies: 125,
    imageUrl: img('photo-1511795409834-ef04bbd61622'), previewGradient: 'preview-gradient-5',
    promptText: `General festive-day celebration portrait. Keep face.
Ethnic festive wear, warm lights and floral accents.
Joyful cinematic look, 4:5. No text.` }),

  p({ id: 'p048', slug: 'horror-aesthetic-girls', title: 'Dark Aesthetic Horror Mood — Girls', categoryId: 'cat_horror', categoryIds: ['cat_horror','cat_girls'], tags: ['horror','aesthetic'], likes: 300, saves: 130, copies: 190,
    imageUrl: img('photo-1515886657613-9f3515b0c78f'), previewGradient: 'preview-gradient-6',
    promptText: `Dark aesthetic horror-mood portrait for girls. Exact face.
Moody cool lighting, elegant dark wardrobe, atmospheric shadows — tasteful, no gore.
4:5 cinematic still. No text.` }),
]
