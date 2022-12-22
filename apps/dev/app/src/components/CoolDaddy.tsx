import { ReactNode } from 'react'

type CoolDaddyPropsType = {
  children?: ReactNode
}

function CoolDaddy({ children }: CoolDaddyPropsType) {
  return (
    <div className="foo">
      Next is a cool child
      {children}
      Previous is a cool child
    </div>
  )
}

export default CoolDaddy
