import { memo, useContext } from 'react'
import { Div } from 'honorable'

import ComponentRemountContext from '~contexts/ComponentRemountContext'

import WithComponentHierarchy from '~components/scene-component/WithComponentHierarchy'
import HierarchyOverlay from '~components/scene-component/hierarchy-overlay/HierarchyOverlay'
import WithComponentError from '~components/scene-component/WithComponentError'
import WithComponentIframeHeight from '~components/scene-component/WithComponentIframeHeight'
import ComponentLoader from '~components/scene-component/ComponentLoader'
import ComponentIframeExpander from '~components/scene-component/ComponentIframeExpander'
import ComponentIframe from '~components/scene-component/ComponentIframe'

type ComponentWindowPropsType = {
  componentPath: string
}

function ComponentWindow({ componentPath }: ComponentWindowPropsType) {
  const { key } = useContext(ComponentRemountContext)

  return (
    <Div
      xflex="y2s"
      flexGrow
      flexShrink={1}
      overflowY="auto"
    >
      <ComponentIframeExpander>
        <HierarchyOverlay>
          <ComponentIframe>
            {({ window, head, setHeight }) => (
              <WithComponentIframeHeight setHeight={setHeight}>
                <WithComponentError key={key}>
                  <WithComponentHierarchy>
                    <ComponentLoader
                      componentPath={componentPath}
                      window={window}
                      head={head}
                    />
                  </WithComponentHierarchy>
                </WithComponentError>
              </WithComponentIframeHeight>
            )}
          </ComponentIframe>
        </HierarchyOverlay>
      </ComponentIframeExpander>
    </Div>
  )
}

export default memo(ComponentWindow)
