import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useSuggestions } from '@/hooks/usePrompts'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/cn'

export function SearchBar({ value, onChange, className, autoFocus = false }) {
  const navigate = useNavigate()
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [local, setLocal] = useState(value || '')
  const wrapRef = useRef(null)
  const addRecent = useUiStore((s) => s.addRecentSearch)
  const recent = useUiStore((s) => s.recentSearches)
  const clearRecent = useUiStore((s) => s.clearRecentSearches)
  const { data: suggestions = [] } = useSuggestions(local)

  useEffect(() => setLocal(value || ''), [value])

  useEffect(() => {
    const t = setTimeout(() => {
      if (onChange && local !== value) onChange(local)
    }, 280)
    return () => clearTimeout(t)
  }, [local, onChange, value])

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const items = [
    ...suggestions.map((s) => ({
      key: `${s.type}-${s.slug}`,
      label: s.label,
      hint: s.type,
      run: () => {
        if (s.type === 'prompt') navigate(`/prompt/${s.slug}`)
        else navigate(`/category/${s.slug}`)
        setOpen(false)
      },
    })),
    ...(!local && recent.length
      ? recent.map((r) => ({
          key: `recent-${r}`,
          label: r,
          hint: 'recent',
          run: () => {
            setLocal(r)
            onChange?.(r)
            addRecent(r)
            navigate(`/search?q=${encodeURIComponent(r)}`)
            setOpen(false)
          },
        }))
      : []),
  ]

  const submit = (q = local) => {
    const cleaned = q.trim()
    if (!cleaned) return
    addRecent(cleaned)
    navigate(`/search?q=${encodeURIComponent(cleaned)}`)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && items[active]) items[active].run()
      else submit()
    } else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={wrapRef} className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
      <Input
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={local}
        autoFocus={autoFocus}
        placeholder="Search prompts, tags, categories…"
        className="pl-10 pr-10"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setLocal(e.target.value)
          setActive(-1)
          setOpen(true)
        }}
        onKeyDown={onKeyDown}
      />
      {local && (
        <button
          type="button"
          aria-label="Clear search"
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full hover:bg-[var(--surface-2)]"
          onClick={() => {
            setLocal('')
            onChange?.('')
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {open && items.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg"
        >
          {!local && recent.length > 0 && (
            <li className="flex items-center justify-between px-3 py-1.5 text-xs text-[var(--muted)]">
              Recent
              <button type="button" className="underline" onClick={clearRecent}>
                Clear
              </button>
            </li>
          )}
          {items.map((item, idx) => (
            <li key={item.key} role="option" aria-selected={idx === active}>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-[var(--surface-2)]',
                  idx === active && 'bg-[var(--surface-2)]',
                )}
                onMouseEnter={() => setActive(idx)}
                onClick={item.run}
              >
                <span>{item.label}</span>
                <span className="text-xs capitalize text-[var(--muted)]">{item.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
