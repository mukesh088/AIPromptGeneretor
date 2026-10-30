import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  displayName: z.string().min(2).optional(),
  password: z.string().min(6, 'At least 6 characters'),
})

export function LoginPage() {
  return <AuthForm mode="login" />
}

export function RegisterPage() {
  return <AuthForm mode="register" />
}

function AuthForm({ mode }) {
  const navigate = useNavigate()
  const toast = useToast()
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const {
    register: reg,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      if (mode === 'login') await login(data)
      else await register(data)
      toast.success('Signed in')
      navigate('/profile')
    } catch (e) {
      toast.error(e.message || 'Auth failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-3 py-8 sm:px-4">
      <Badge tone="featured" className="mb-3 normal-case">
        Database auth
      </Badge>
      <h1 className="font-display text-2xl font-bold">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Admin: admin@admin.local / admin123 (after running the API seed).
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {mode === 'register' && (
          <div>
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" {...reg('displayName')} />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...reg('email')} />
          {errors.email && <p className="mt-1 text-sm text-[var(--danger)]">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} {...reg('password')} />
          {errors.password && <p className="mt-1 text-sm text-[var(--danger)]">{errors.password.message}</p>}
        </div>
        <Button type="submit" variant="gradient" className="w-full">
          {mode === 'login' ? 'Sign in' : 'Register'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-[var(--muted)]">
        {mode === 'login' ? (
          <>No account? <Link className="text-[var(--accent)]" to="/register">Register</Link></>
        ) : (
          <>Have an account? <Link className="text-[var(--accent)]" to="/login">Sign in</Link></>
        )}
      </p>
    </div>
  )
}

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const toast = useToast()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="px-3 py-10 text-center">
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Sign in to sync later. Guest saves already work on this device.</p>
        <Button className="mt-4" onClick={() => navigate('/login')}>
          Sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-3 py-6 sm:px-4">
      <Badge tone="demo" className="mb-3 normal-case">Demo identity</Badge>
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">{user.email} · role: {user.role}</p>
      <div className="mt-6 space-y-3">
        <Label htmlFor="dn">Display name</Label>
        <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Button
          onClick={() => {
            updateProfile({ displayName })
            toast.success('Profile updated (local demo)')
          }}
        >
          Save
        </Button>
        {user.role === 'admin' && (
          <Button variant="secondary" onClick={() => navigate('/admin')}>
            Open demo admin
          </Button>
        )}
        <Button variant="outline" onClick={async () => { await logout(); navigate('/') }}>
          Sign out
        </Button>
        <Button variant="ghost" onClick={() => navigate('/history')}>
          Generation history
        </Button>
      </div>
    </div>
  )
}
