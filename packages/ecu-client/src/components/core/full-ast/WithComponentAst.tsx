import { ReactNode } from 'react'

type WithComponentAstPropsType = {
  code: string
  children: ReactNode
}

function WithComponentAst({ code, children }: WithComponentAstPropsType) {
  console.log('code', code)

  return (
    <>
      {children}
    </>
  )
}

export default WithComponentAst
