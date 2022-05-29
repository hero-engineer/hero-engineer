import { Dispatch, SetStateAction, createContext } from 'react'

import { EcuType } from '../types'

export type EcuDispatcherType = Dispatch<SetStateAction<EcuType>>
export type EcuContextType = [EcuType, EcuDispatcherType]

export default createContext<EcuContextType>([{} as EcuType, () => {}])
