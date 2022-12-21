import { Div } from 'honorable'
import { ReactNode } from 'react'

type ResponsiveLayoutPropsType = {
  children: ReactNode
}

function ResponsiveLayout({ children }: ResponsiveLayoutPropsType) {
  return (
    <Div
      xflex="y2s"
      flexGrow
      overflowY="auto"
    >
      <Div
        xflex="y2s"
        flexGrow
        width="100%"
        maxWidth={1024 + 256 + 64 + 16 + 4}
        mx="auto"
        mt={1}
        px={1}
        pb={6}
      >
        {children}
      </Div>
    </Div>
  )
}

export default ResponsiveLayout
