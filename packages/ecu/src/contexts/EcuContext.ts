import { createContext } from 'react'

import { EcuContextType } from '../types'

export default createContext<EcuContextType>([{}, () => {}])
