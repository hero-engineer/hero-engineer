import { Suspense, lazy, memo } from 'react'

function ComponentEditor({ component }: any) {
  const Component = lazy(() => import(/* @vite-ignore */ component.file.path))

  return (
    <Suspense fallback={<>Loading...</>}>
      <Component />
    </Suspense>
  )
}

export default memo(ComponentEditor)
