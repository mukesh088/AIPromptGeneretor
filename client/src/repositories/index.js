import { demoRepository } from './demoRepository'
import { apiRepository } from './apiRepository'

const useApi = String(import.meta.env.VITE_USE_API || 'true') !== 'false'

export const promptRepository = useApi ? apiRepository : demoRepository
export const isApiMode = useApi
