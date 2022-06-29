import { Dispatch, SetStateAction } from 'react'

export type EcuType = {
  activeComponentPath?: string
  dragState?: {
    sourcePath?: string
    targetPath?: string
    position?: 'before' | 'after'
    rect?: DOMRect
    mouse?: { x: number, y: number }
  }
}

export type EcuDispatcherType = Dispatch<SetStateAction<EcuType>>
export type EcuContextType = [EcuType, EcuDispatcherType]
