import { ReactNode, useContext } from 'react'
import { Div } from 'honorable'

import IsComponentRefreshingContext from '../../contexts/IsComponentRefreshingContext'

type WithIsComponentRefreshingLayerPropsType = {
  children: ReactNode
}

function WithIsComponentRefreshingLayer({ children }: WithIsComponentRefreshingLayerPropsType) {
  const { isComponentRefreshing } = useContext(IsComponentRefreshingContext)

  return (
    <Div position="relative">
      {children}
      {isComponentRefreshing && (
        <Div
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          backgroundColor="transparency(black, 85)"
        />
      )}
    </Div>
  )
}

export default WithIsComponentRefreshingLayer
