import { Suspense, lazy, memo, useContext } from 'react'

import ComponentRemountContext from '~contexts/ComponentRemountContext'

type ComponentLoaderPropsType = {
  componentPath: string
  decoratorPaths: string[]
  head?: HTMLHeadElement
}

// A component fetcher that uses React.lazy
function ComponentLoader({ componentPath, decoratorPaths, head }: ComponentLoaderPropsType) {
  const { key } = useContext(ComponentRemountContext)

  const decorators = decoratorPaths.map(decoratorPath => lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ decoratorPath)))
  const Component = lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ componentPath))

  return (
    <Suspense>
      {decorators.reduce((children, Decorator) => (
        <Decorator head={head}>
          {children}
        </Decorator>
      ), <Component key={key} />)}
    </Suspense>
  )
}

export default memo(ComponentLoader)
