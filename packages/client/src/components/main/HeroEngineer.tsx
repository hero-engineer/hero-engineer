import '../../css/common.css'

import { ViteHotContext } from 'vite/types/hot'
import { ReactNode } from 'react'

import ProviderHeroEngineer from '~components/providers/ProviderHeroEngineer'
import WithProcessors from '~components/main/WithProcessors'
import Router from '~components/main/Router'
import WithHomeButton from '~components/main/WithHomeButton'

type HeroEngineerPropsType = {
  mode?: string
  hot?: ViteHotContext | null
  children: ReactNode
}

// The master component that wraps the entire application
// TODO remove mode and hot
function HeroEngineer({ mode = 'production', hot = null, children }: HeroEngineerPropsType) {
  return (
    <ProviderHeroEngineer
      mode={mode}
      hot={hot}
    >
      <WithProcessors>
        <Router>
          <WithHomeButton>
            {children}
          </WithHomeButton>
        </Router>
      </WithProcessors>
    </ProviderHeroEngineer>
  )
}

export default HeroEngineer
