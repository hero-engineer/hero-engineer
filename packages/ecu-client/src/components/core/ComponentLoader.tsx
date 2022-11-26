import { Suspense, lazy, memo } from 'react'

type ComponentLoaderPropsType = {
  componentPath: string
  decoratorPaths: string[]
  head?: HTMLHeadElement
}

// A component fetcher that uses React.lazy
function ComponentLoader({ componentPath, decoratorPaths, head }: ComponentLoaderPropsType) {
  const decorators = decoratorPaths.map(decoratorPath => lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ decoratorPath)))
  const Component = lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ componentPath))

  return (
    <Suspense>
      {decorators.reduce((children, Decorator) => (
        <Decorator head={head}>
          {children}
        </Decorator>
      ), <Component />)}
    </Suspense>
  )
}

export default memo(ComponentLoader)
