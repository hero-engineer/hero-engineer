import { RefObject, useRef } from 'react'
import { CssBaseline, Div, ThemeProvider } from 'honorable'

import theme from '../../theme'

import useClearHierarchyIdsAndComponentDeltaOnClick from '../../hooks/useClearHierarchyIdsAndComponentDeltaOnClick'

import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'
import ContextualInformation from './ContextualInformation'

type ComponentWindowPropsType = {
  componentPath: string
  componentRef: RefObject<HTMLDivElement>
}

function ComponentWindow({ componentPath, componentRef }: ComponentWindowPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  useClearHierarchyIdsAndComponentDeltaOnClick(rootRef)

  return (
    <Div
      ref={rootRef}
      flexGrow
      flexShrink={0}
      pb={6}
    >
      <ComponentIframe componentRef={componentRef}>
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
