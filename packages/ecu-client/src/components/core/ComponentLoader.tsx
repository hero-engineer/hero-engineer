import { Suspense, lazy, memo } from 'react'

type ComponentLoaderPropsType = {
  componentPath: string
}

function ComponentLoader({ componentPath }: ComponentLoaderPropsType) {
  const Component = lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ componentPath))

  return (
    <Suspense fallback={<>Loading...</>}>
      <Component />
    </Suspense>
  )
}

export default memo(ComponentLoader)
