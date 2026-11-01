import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { brand } from '@/lib/brand'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Label } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { promptRepository } from '@/repositories'

export function AboutPage() {
  return (
    <Page title="About Us">
      <p>{brand.description}</p>
      <p className="mt-3">
        {brand.name} helps you discover and copy AI photo prompts for ChatGPT, Gemini, and other tools —
        inspired by the browsing style of sites like promptpin.in, with original branding and content.
      </p>
    </Page>
  )
}

export function ContactPage() {
  const toast = useToast()
  const { register, handleSubmit, reset } = useForm()
  return (
    <Page title="Contact">
      <p className="mb-4 text-sm text-[var(--muted)]">Email: {brand.supportEmail}</p>
      <form
        className="max-w-md space-y-3"
        onSubmit={handleSubmit(() => {
          toast.success('Message recorded locally (demo)')
          reset()
        })}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required {...register('email')} />
        </div>
        <div>
          <Label htmlFor="msg">Message</Label>
          <Textarea id="msg" required {...register('message')} />
        </div>
        <Button type="submit">Send</Button>
      </form>
    </Page>
  )
}

export function PrivacyPage() {
  return (
    <Page title="Privacy">
      <p>
        Phase 1 stores theme preference, guest bookmarks, demo auth identity, and generation history in
        your browser localStorage. No provider API keys are collected. A production privacy policy will
        accompany the Phase 2 backend.
      </p>
    </Page>
  )
}

export function TermsPage() {
  return (
    <Page title="Terms">
      <p>
        This demonstration is provided as-is for product exploration. Do not upload sensitive personal
        photos to demo tools. Generated sample outputs are illustrative and not commercial assets.
      </p>
    </Page>
  )
}

export function SubmitPage() {
  const toast = useToast()
  const schema = z.object({
    title: z.string().min(3),
    promptTemplate: z.string().min(20),
    contentType: z.enum(['image', 'video', 'work']),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema), defaultValues: { contentType: 'image' } })

  return (
    <Page title="Submit a prompt">
      <p className="mb-4 text-sm text-[var(--muted)]">
        Submissions are saved as local drafts for demo review — not sent to a server yet.
      </p>
      <form
        className="max-w-lg space-y-3"
        onSubmit={handleSubmit(async (data) => {
          await promptRepository.createPrompt({
            ...data,
            shortDescription: 'Community submission (demo draft)',
            categoryId: 'cat_cinematic',
            status: 'pending',
            usageSteps: { en: ['Await review'], hi: ['समीक्षा की प्रतीक्षा'] },
            tips: { en: [], hi: [] },
            tags: ['submission'],
          })
          toast.success('Submitted as pending draft (local demo)')
          reset()
        })}
      >
        <div>
          <Label>Title</Label>
          <Input {...register('title')} />
          {errors.title && <p className="text-sm text-[var(--danger)]">{errors.title.message}</p>}
        </div>
        <div>
          <Label>Type</Label>
          <select className="w-full min-h-11 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3" {...register('contentType')}>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="work">Work</option>
          </select>
        </div>
        <div>
          <Label>Prompt</Label>
          <Textarea {...register('promptTemplate')} />
          {errors.promptTemplate && (
            <p className="text-sm text-[var(--danger)]">{errors.promptTemplate.message}</p>
          )}
        </div>
        <Button type="submit" variant="gradient">
          Submit for review
        </Button>
      </form>
    </Page>
  )
}

export function NotFoundPage() {
  return (
    <div className="px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">404</h1>
      <p className="mt-2 text-[var(--muted)]">That page doesn’t exist.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to Explore</Link>
      </Button>
    </div>
  )
}

function Page({ title, children }) {
  return (
    <div className="mx-auto max-w-2xl px-3 py-6 sm:px-4 md:px-6">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <div className="mt-4 space-y-3 text-[var(--fg)]/90">{children}</div>
    </div>
  )
}
