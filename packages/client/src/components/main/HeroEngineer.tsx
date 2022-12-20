import '../../css/common.css'

import { ReactNode } from 'react'

import ProviderHeroEngineer from '~components/providers/ProviderHeroEngineer'
import WithProcessors from '~components/main/WithProcessors'
import Router from '~components/main/Router'
import WithHomeButton from '~components/main/WithHomeButton'

type HeroEngineerPropsType = {
  env: Record<string, any>
  children: ReactNode
}

// The master component that wraps the entire application
// TODO remove mode and hot
function HeroEngineer({ env, children }: HeroEngineerPropsType) {
  return (
    <ProviderHeroEngineer env={env}>
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
