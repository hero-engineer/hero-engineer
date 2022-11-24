import { RefObject, memo, useRef } from 'react'
import { CssBaseline, Div, ThemeProvider } from 'honorable'

import theme from '../../theme'

import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'
import ContextualInformation from './ContextualInformation'

type ComponentWindowPropsType = {
  componentPath: string
  componentRef: RefObject<HTMLDivElement>
}

function ComponentWindow({ componentPath, componentRef }: ComponentWindowPropsType) {
  return (
    <Div
      xflex="y2s"
      flexGrow
      pb={6}
    >
      <ComponentIframe>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WithIsComponentRefreshingLayer>
            <div ref={componentRef}>
              <ComponentLoader componentPath={componentPath} />
            </div>
          </WithIsComponentRefreshingLayer>
          <ContextualInformation />
        </ThemeProvider>
      </ComponentIframe>
    </Div>
  )
}

export default ComponentWindow // Do not memoize this component, it will break the iframe
