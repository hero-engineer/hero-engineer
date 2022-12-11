import { memo, useContext } from 'react'
// import { DndProvider } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'
// import { CssBaseline, Div, ThemeProvider } from 'honorable'
import { Div } from 'honorable'

import ComponentRemountContext from '~contexts/ComponentRemountContext'

import WithComponentHierarchy from '~core/full-ast/WithComponentHierarchy'
import WithComponentError from '~core/component-window/WithComponentError'

// import theme from '../../../theme'
// import EditionOverlay from '../edition-overlay/EditionOverlay'
// import ProviderEmotion from '../providers/ProviderEmotion'

import ComponentIframeExpander from './ComponentIframeExpander'
import ComponentIframe from './ComponentIframe'
import ComponentLoader from './ComponentLoader'
import WithComponentIframeHeight from './WithComponentIframeHeight'

type ComponentWindowPropsType = {
  componentPath: string
  decoratorPaths: string[]
}

function ComponentWindow({ componentPath, decoratorPaths }: ComponentWindowPropsType) {
  const { key } = useContext(ComponentRemountContext)

  return (
    <Div
      xflex="y2s"
      flexGrow
      flexShrink={1}
      overflowY="auto"
    >
      <ComponentIframeExpander>
        <ComponentIframe>
          {({ window, head, setHeight }) => (
            // <ProviderEmotion head={head}>
            // <DndProvider
            //   backend={HTML5Backend}
            //   context={window}
            // >
              // {/* <ThemeProvider theme={theme}> */}
              // {/* <CssBaseline /> */}
            <WithComponentIframeHeight setHeight={setHeight}>
              {/* TODO investigate why EditionOverlay should be inside of the iframe, and if removable remove also ThemeProvider */}
              {/* <EditionOverlay> */}
              <WithComponentError key={key}>
                <WithComponentHierarchy>
                  <ComponentLoader
                    head={head}
                    componentPath={componentPath}
                    decoratorPaths={decoratorPaths}
                  />
                </WithComponentHierarchy>
              </WithComponentError>
              {/* </EditionOverlay> */}
            </WithComponentIframeHeight>
              // {/* </ThemeProvider> */}
            // </DndProvider>
            // </ProviderEmotion>
          )}
        </ComponentIframe>
      </ComponentIframeExpander>
    </Div>
  )
}

export default memo(ComponentWindow)
