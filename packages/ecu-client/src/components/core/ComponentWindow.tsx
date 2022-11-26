import { memo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CssBaseline, Div, ThemeProvider, mergeTheme } from 'honorable'

import theme from '../../theme'

import ComponentIframeWidthExpander from './ComponentIframeWidthExander'
import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'
import WithComponentScrenshot from './WithComponentScrenshot'
import EmotionProvider from './EmotionProvider'
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
  decoratorPaths: string[]
}

function ComponentWindow({ componentPath, decoratorPaths }: ComponentWindowPropsType) {
  return (
    <Div
      xflex="y2s"
      flexGrow
      flexShrink={1}
      backgroundColor="background-component"
      overflowY="auto"
    >
      <ComponentIframeWidthExpander>
        <ComponentIframe>
          {({ window, head }) => (
            <EmotionProvider head={head}>
              <DndProvider
                backend={HTML5Backend}
                context={window}
              >
                <ThemeProvider theme={componentTheme}>
                  <CssBaseline />
                  <WithIsComponentRefreshingLayer>
                    <WithComponentScrenshot>
                      <ComponentLoader
                        head={head}
                        componentPath={componentPath}
                        decoratorPaths={decoratorPaths}
                      />
                    </WithComponentScrenshot>
                  </WithIsComponentRefreshingLayer>
                  <ContextualInformation />
                </ThemeProvider>
              </DndProvider>
            </EmotionProvider>
          )}
        </ComponentIframe>
      </ComponentIframeWidthExpander>
    </Div>
  )
}

export default memo(ComponentWindow)
