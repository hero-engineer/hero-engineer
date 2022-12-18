import { ViteHotContext } from 'vite/types/hot'
import { createContext } from 'react'

export default createContext<ViteHotContext | null>(null)
