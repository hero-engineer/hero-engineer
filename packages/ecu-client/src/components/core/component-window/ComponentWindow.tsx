import { memo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { CssBaseline, Div, ThemeProvider } from 'honorable'

import themeComponent from '../../../themeComponent'
import EditionOverlay from '../edition-overlay/EditionOverlay'
import ProviderEmotion from '../providers/ProviderEmotion'

import ComponentIframeExpander from './ComponentIframeExpander'
import WithComponentIframeHeight from './WithComponentIframeHeight'
import WithComponentScrenshot from './WithComponentScrenshot'
import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'

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
      <ComponentIframeExpander>
        <ComponentIframe>
          {({ window, head, setHeight }) => (
            <ProviderEmotion head={head}>
              <DndProvider
                backend={HTML5Backend}
                context={window}
              >
                <ThemeProvider theme={themeComponent}>
                  <CssBaseline />
                  <WithComponentIframeHeight setHeight={setHeight}>
                    <EditionOverlay>
                      <WithComponentScrenshot>
                        <ComponentLoader
                          head={head}
                          componentPath={componentPath}
                          decoratorPaths={decoratorPaths}
                        />
                      </WithComponentScrenshot>
                    </EditionOverlay>
                  </WithComponentIframeHeight>
                </ThemeProvider>
              </DndProvider>
            </ProviderEmotion>
          )}
        </ComponentIframe>
      </ComponentIframeExpander>
    </Div>
  )
}

export default memo(ComponentWindow)
