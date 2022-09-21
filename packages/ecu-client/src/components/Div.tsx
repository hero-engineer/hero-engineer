import { PropsWithChildren } from 'react'

type DivProps = PropsWithChildren<{
  className?: string
  id: string
}>

function Div({ id, className, children }: DivProps) {
  return import.meta.env.MODE === 'production'
    ? <div className={className}>{children}</div>
    : (
      <DivContainer
        id={id}
        className={className}
      >
        {children}
      </DivContainer>
    )
}

function DivContainer({ id, className, children }: DivProps) {
  return (
    <div
      className={className}
      id={id}
    >
      {children}
    </div>
  )
}

export default Div
