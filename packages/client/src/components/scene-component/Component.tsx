import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'

import TabsContext from '~contexts/TabsContext'

import useCurrentComponentPath from '~hooks/useCurrentComponentPath'

import ControlsBar from '~components/scene-component/controls/ControlsBar'
import ComponentWindow from '~components/scene-component/ComponentWindow'
import WidthBar from '~components/scene-component/footer/WidthBar'
import HierarchyBar from '~components/scene-component/footer/HierarchyBar'
import RetractablePanel from '~components/layout/RetractablePanel'
import PanelHierarchy from '~components/scene-component/panels/hierarchy/PanelHierarchy'
import PanelStyles from '~components/scene-component/panels/styles/PanelStyles'

function Component() {
  const { '*': ecuComponentPath = '' } = useParams()

  const { tabs, setTabs } = useContext(TabsContext)

  const componentPath = useCurrentComponentPath()

  useEffect(() => {
    if (!ecuComponentPath) return

    const url = `/_hero_/~/${ecuComponentPath}`

    if (tabs.some(tab => tab.url === url)) return

    const labelParts = componentPath.split('/').pop()?.split('.')

    // Pop extension
    labelParts?.pop()

    setTabs(tabs => [...tabs, { url, label: labelParts?.join('.') ?? '?' }])
  // Omitting tabs to trigger on ecuComponentPath change only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecuComponentPath, componentPath, setTabs])

  if (!componentPath) return null

  return (
    <>
      <ControlsBar />
      <Div
        xflex="x4s"
        flexGrow
        maxHeight="100%"
      >
        <RetractablePanel
          direction="left"
          items={{
            hierarchy: <PanelHierarchy />,
          }}
        />
        <Div
          xflex="y2s"
          flexGrow
          maxHeight="100%"
          overflow="hidden"
          backgroundColor="background-component"
        >
          <ComponentWindow componentPath={componentPath} />
          <WidthBar />
          <HierarchyBar />
        </Div>
        <RetractablePanel
          direction="right"
          items={{
            styles: <PanelStyles />,
          }}
        />
      </Div>
    </>
  )
}

export default Component
