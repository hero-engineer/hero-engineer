import { Suspense, lazy, memo } from 'react'

import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'

type ComponentLoaderPropsType = {
  componentPath: string
}

// A component fetcher that uses React.lazy
function ComponentLoader({ componentPath }: ComponentLoaderPropsType) {
  const Component = lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ componentPath))

  return (
    <Suspense>
      <WithIsComponentRefreshingLayer>
        <Component />
      </WithIsComponentRefreshingLayer>
    </Suspense>
  )
}

export default memo(ComponentLoader)
