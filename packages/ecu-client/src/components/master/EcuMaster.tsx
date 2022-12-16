import '../../css/common.css'

import { ViteHotContext } from 'vite/types/hot'
import { ReactNode } from 'react'

import ProviderMaster from '~components/providers/ProviderMaster'
import WithProcessors from '~components/master/WithProcessors'
import Router from '~components/master/Router'
import WithEcuHomeButton from '~components/master/WithEcuHomeButton'

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
      <WithProcessors>
        <Router>
          <WithEcuHomeButton>
            {children}
          </WithEcuHomeButton>
        </Router>
      </WithProcessors>
    </ProviderMaster>
  )
}

export default EcuMaster
