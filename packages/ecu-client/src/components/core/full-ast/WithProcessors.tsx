import { ReactNode } from 'react'

import useProcessors from '~hooks/useProcessors'

type WithProcessorsPropsType = {
  children: ReactNode
}

function WithProcessors({ children }: WithProcessorsPropsType) {
  useProcessors()

  return (
    <>
      {children}
    </>
  )
}

export default WithProcessors
