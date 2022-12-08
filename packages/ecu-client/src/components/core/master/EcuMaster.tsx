import '../../../css/common.css'

import { ViteHotContext } from 'vite/types/hot'
import { ReactNode } from 'react'

import WithAsts from '@core/master/WithAsts'

import ProviderMaster from '../providers/ProviderMaster'

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
      <WithAsts>
        <Router>
          <WithEcuHomeButton>
            {children}
          </WithEcuHomeButton>
        </Router>
      </WithAsts>
    </ProviderMaster>
  )
}

export default EcuMaster
