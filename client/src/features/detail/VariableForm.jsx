import { Input, Textarea, Label } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function VariableForm({ variables = [], values, onChange, onReset }) {
  if (!variables.length) {
    return <p className="text-sm text-[var(--muted)]">This template has no editable fields.</p>
  }

  return (
    <div className="space-y-3">
      {variables.map((v) => (
        <div key={v.key}>
          <Label htmlFor={`var-${v.key}`}>
            {v.label}
            {v.required !== false ? ' *' : ''}
          </Label>
          {v.type === 'select' ? (
            <select
              id={`var-${v.key}`}
              className="flex w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3 text-base"
              value={values[v.key] ?? v.default ?? ''}
              onChange={(e) => onChange({ ...values, [v.key]: e.target.value })}
            >
              {(v.options || []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : v.type === 'textarea' ? (
            <Textarea
              id={`var-${v.key}`}
              value={values[v.key] ?? v.default ?? ''}
              onChange={(e) => onChange({ ...values, [v.key]: e.target.value })}
            />
          ) : (
            <Input
              id={`var-${v.key}`}
              value={values[v.key] ?? v.default ?? ''}
              placeholder={v.placeholder || v.help || v.label || ''}
              onChange={(e) => onChange({ ...values, [v.key]: e.target.value })}
            />
          )}
          {v.help && <p className="mt-1 text-xs text-[var(--muted)]">{v.help}</p>}
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={onReset}>
        Reset to defaults
      </Button>
    </div>
  )
}

export function defaultsFromVariables(variables = []) {
  return Object.fromEntries(variables.map((v) => [v.key, v.default ?? '']))
}
