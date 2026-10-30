import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { promptRepository } from '@/repositories'

export function usePromptList(filters) {
  return useInfiniteQuery({
    queryKey: ['prompts', filters],
    queryFn: ({ pageParam = 0 }) =>
      promptRepository.listPrompts({ ...filters, cursor: pageParam, limit: 24 }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: 0,
  })
}

export function usePrompt(slug) {
  return useQuery({
    queryKey: ['prompt', slug],
    queryFn: () => promptRepository.getPromptBySlug(slug),
    enabled: !!slug,
  })
}

export function useRelated(prompt) {
  return useQuery({
    queryKey: ['related', prompt?.id],
    queryFn: () => promptRepository.getRelated(prompt),
    enabled: !!prompt?.id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => promptRepository.listCategories(),
  })
}

export function useCategory(slug) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => promptRepository.getCategory(slug),
    enabled: !!slug,
  })
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => promptRepository.listCollections(),
  })
}

export function useCollection(slug) {
  return useQuery({
    queryKey: ['collection', slug],
    queryFn: () => promptRepository.getCollection(slug),
    enabled: !!slug,
  })
}

export function useSuggestions(q) {
  return useQuery({
    queryKey: ['suggestions', q],
    queryFn: () => promptRepository.searchSuggestions(q),
    enabled: (q || '').length > 0,
  })
}

export function useAdminPrompts(filters) {
  return useQuery({
    queryKey: ['admin-prompts', filters],
    queryFn: () => promptRepository.listPrompts({ ...filters, status: 'all', limit: 200 }),
  })
}

export function useSavePromptMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (prompt) => promptRepository.savePrompt(prompt),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prompts'] })
      qc.invalidateQueries({ queryKey: ['admin-prompts'] })
      qc.invalidateQueries({ queryKey: ['prompt'] })
    },
  })
}
