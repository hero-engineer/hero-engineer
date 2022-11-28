import { memo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CssBaseline, Div, ThemeProvider } from 'honorable'

import themeComponent from '../../themeComponent'

import ComponentIframeWidthExpander from './ComponentIframeWidthExander'
import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithIsComponentRefreshingLayer from './WithIsComponentRefreshingLayer'
import WithComponentScrenshot from './WithComponentScrenshot'
import EmotionProvider from './EmotionProvider'
import ContextualInformation from './ContextualInformation'

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
                <ThemeProvider theme={themeComponent}>
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
