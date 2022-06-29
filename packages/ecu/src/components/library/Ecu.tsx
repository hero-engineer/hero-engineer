import { useMemo, useState } from 'react'

import { EcuContextType, EcuType } from '../../types'
import EcuContext from '../../contexts/EcuContext'

function Ecu({ children }: any) {
  const [ecu, setEcu] = useState<EcuType>({})
  const ecuValue = useMemo<EcuContextType>(() => [ecu, setEcu], [ecu])

  console.log('ecu', ecu)

  return (
    <EcuContext.Provider value={ecuValue}>
      {children}
    </EcuContext.Provider>
  )
}

export default Ecu
