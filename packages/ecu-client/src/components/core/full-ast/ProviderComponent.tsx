import { ReactNode, useMemo, useState } from 'react'

import AstContext, { AstContextType } from '@contexts/AstContext'

type ProviderComponentPropsType= {
  children: ReactNode
}

function ProviderComponent({ children }: ProviderComponentPropsType) {
  const [ast, setAst] = useState('')
  const astContextValue = useMemo<AstContextType>(() => ({ ast, setAst }), [ast])

  return (
    <AstContext.Provider value={astContextValue}>
      {children}
    </AstContext.Provider>
  )
}

export default ProviderComponent
