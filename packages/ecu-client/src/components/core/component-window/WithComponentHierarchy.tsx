import { ReactNode } from 'react'

type WithComponentHierarchyPropsType = {
  window: Window | null
  children: ReactNode
}

function WithComponentHierarchy({ window, children }: WithComponentHierarchyPropsType) {
  // console.log('window', window)

  return (
    <>
      {children}
    </>
  )
}

export default WithComponentHierarchy
