import { Suspense, lazy, memo } from 'react'

function ComponentLoader({ component }: any) {
  const Component = lazy(() => import(/* @vite-ignore */ /* webpackIgnore: true */ component.payload.path))

  return (
    <Suspense fallback={<>Loading...</>}>
      <Component />
    </Suspense>
  )
}

export default memo(ComponentLoader)
