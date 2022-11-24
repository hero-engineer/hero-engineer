import { RefObject, useRef } from 'react'
import { CssBaseline, Div, ThemeProvider, mergeTheme } from 'honorable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import theme from '../../theme'

import useClearHierarchyIdsAndComponentDeltaOnClick from '../../hooks/useClearHierarchyIdsAndComponentDeltaOnClick'

import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'
import ContextualInformation from './ContextualInformation'

const componentTheme = mergeTheme(theme, {
  name: 'Ecu-Component',
  stylesheet: {
    html: [
      {
        fontSize: 16,
      },
    ],
  },
})

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
        {({ window }) => (
          <DndProvider
            backend={HTML5Backend}
            context={window}
          >
            <ThemeProvider theme={componentTheme}>
              <CssBaseline />
              <WithIsComponentRefreshingLayer>
                <div ref={componentRef}>
                  <ComponentLoader componentPath={componentPath} />
                </div>
              </WithIsComponentRefreshingLayer>
              <ContextualInformation />
            </ThemeProvider>
          </DndProvider>
        )}
      </ComponentIframe>
    </Div>
  )
}

export default ComponentWindow // Do not memoize this component, it will break the iframe
