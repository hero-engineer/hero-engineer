import { nanoid } from 'nanoid'

export type Particule = {
  // A unique address for this particule
  address: string
  // How a human or a machine understands what the particule does
  role: string
  // Internal state
  state: any
  // front-facing API
  payload: any
}

export const createAddress = nanoid
