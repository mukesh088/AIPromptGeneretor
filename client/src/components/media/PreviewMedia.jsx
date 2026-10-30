import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/Badge'

function resolveUrl(url) {
  if (!url) return null
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url
  const base = import.meta.env.VITE_API_BASE_URL || ''
  return `${base}${url}`
}

export function PreviewMedia({
  preview,
  title,
  className,
  showIllustrative = true,
  badge,
  typeLabel,
}) {
  const [imgError, setImgError] = useState(false)
  const ratio = preview?.width && preview?.height ? preview.width / preview.height : 3 / 4
  const imageUrl = resolveUrl(preview?.url)
  const showImage = imageUrl && !imgError && preview?.kind !== 'work'
  const showWork = preview?.kind === 'work' || (!showImage && preview?.label && preview?.kind !== 'gradient')

  return (
    <div
      className={cn('relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface-2)]', className)}
      style={{ aspectRatio: String(ratio) }}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={preview?.alt || title || ''}
          width={preview?.width || undefined}
          height={preview?.height || undefined}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : showWork ? (
        <div
          className={cn(
            'absolute inset-0 flex flex-col justify-between p-4',
            preview?.gradient || 'preview-gradient-6',
          )}
        >
          <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            Work prompt
          </span>
          <p className="font-display text-lg font-semibold leading-snug text-white drop-shadow">
            {preview?.label || title}
          </p>
        </div>
      ) : (
        <div className={cn('absolute inset-0', preview?.gradient || 'preview-gradient-1')}>
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236,72,153,.35), transparent 45%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-3">
            <p className="line-clamp-2 font-display text-sm font-medium text-white/90 drop-shadow">
              {title}
            </p>
          </div>
        </div>
      )}

      <div className="absolute left-2 top-2 flex flex-wrap gap-1">
        {typeLabel && <Badge tone="type">{typeLabel}</Badge>}
        {badge === 'new' && <Badge tone="new">New</Badge>}
        {badge === 'featured' && <Badge tone="featured">Featured</Badge>}
        {badge === 'curated' && <Badge tone="curated">Curated</Badge>}
      </div>

      {showIllustrative && (preview?.format === 'illustrative' || !preview?.url) && preview?.kind !== 'work' && (
        <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/90">
          Illustrative
        </span>
      )}
    </div>
  )
}
