import '../../css/common.css'

import { ViteHotContext } from 'vite/types/hot'
import { ReactNode } from 'react'

import ProviderMaster from './ProviderMaster'
import Router from './Router'
import WithEcuHomeButton from './WithEcuHomeButton'

type EcuMasterPropsType = {
  mode?: string
  hot?: ViteHotContext | null
  children: ReactNode
}

// The master component that wraps the entire application
function EcuMaster({ mode = 'production', hot = null, children }: EcuMasterPropsType) {
  return (
    <ProviderMaster
      mode={mode}
      hot={hot}
    >
      <Router>
        <WithEcuHomeButton>
          {children}
        </WithEcuHomeButton>
      </Router>
    </ProviderMaster>
  )
}

export default EcuMaster
