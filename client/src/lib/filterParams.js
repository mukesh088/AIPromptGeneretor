import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useGalleryFilters(defaults = {}) {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      contentType: params.get('type') || defaults.contentType || '',
      category: params.get('category') || defaults.category || '',
      tag: params.get('tag') || defaults.tag || '',
      tool: params.get('tool') || '',
      aspect: params.get('aspect') || '',
      sort: params.get('sort') || 'curated',
      q: params.get('q') || '',
      requiresReferenceImage:
        params.get('ref') === '1' ? true : params.get('ref') === '0' ? false : undefined,
    }),
    [params, defaults.contentType, defaults.category, defaults.tag],
  )

  const setFilters = useCallback(
    (next) => {
      const n = new URLSearchParams()
      const merged = { ...filters, ...next }
      if (merged.contentType && merged.contentType !== 'all') n.set('type', merged.contentType)
      if (merged.category) n.set('category', merged.category)
      if (merged.tag) n.set('tag', merged.tag)
      if (merged.tool) n.set('tool', merged.tool)
      if (merged.aspect) n.set('aspect', merged.aspect)
      if (merged.sort && merged.sort !== 'curated') n.set('sort', merged.sort)
      if (merged.q) n.set('q', merged.q)
      if (merged.requiresReferenceImage === true) n.set('ref', '1')
      if (merged.requiresReferenceImage === false) n.set('ref', '0')
      setParams(n, { replace: true })
    },
    [filters, setParams],
  )

  return { filters, setFilters }
}
