import { Suspense, lazy, memo, useContext } from 'react'

import ComponentRemountContext from '~contexts/ComponentRemountContext'

import useDecoratorPaths from '~hooks/useDecoratorPaths'

type ComponentLoaderPropsType = {
  componentPath: string
  head: HTMLHeadElement | null
  window: Window | null
}

// A component fetcher that uses React.lazy
function ComponentLoader({ componentPath, window, head }: ComponentLoaderPropsType) {
  const { key } = useContext(ComponentRemountContext)

  const decoratorPaths = useDecoratorPaths(componentPath)
  const decorators = (decoratorPaths || []).map(decoratorPath => lazy(() => import(/* @vite-ignore */ decoratorPath)))
  const Component = lazy(() => import(/* @vite-ignore */ componentPath))

  return (
    <Suspense>
      {decorators.reduce((children, Decorator) => (
        <Decorator
          window={window}
          head={head}
        >
          {children}
        </Decorator>
      ), <Component key={key} />)}
    </Suspense>
  )
}

export default memo(ComponentLoader)
