import { ReactNode } from 'react'

type ProviderComponentPropsType= {
  children: ReactNode
}

function ProviderComponent({ children }: ProviderComponentPropsType) {
  return (
    <>
      {children}
    </>
  )
}

export default ProviderComponent
