import { createContext } from 'react'

import { EcuContextType, EcuType } from '../types'

export default createContext<EcuContextType>([{} as EcuType, () => {}])
