import { Suspense, lazy, memo } from 'react'

type ComponentLoaderPropsType = {
  componentPath: string
}

// A component fetcher that uses React.lazy
function ComponentLoader({ componentPath }: ComponentLoaderPropsType) {
  const Component = lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ componentPath))

  return (
    <Suspense>
      <Component />
    </Suspense>
  )
}

export default memo(ComponentLoader)
