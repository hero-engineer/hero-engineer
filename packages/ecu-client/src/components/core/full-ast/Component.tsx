import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'
import { RiNodeTree } from 'react-icons/ri'

import { ComponentFileMetadataQuery, ComponentFileQueryDataType } from '~queries'

import TabsContext from '~contexts/TabsContext'
import IsInteractiveModeContext from '~contexts/IsInteractiveModeContext'

import useQuery from '~hooks/useQuery'
import useCurrentComponentPath from '~hooks/useCurrentComponentPath'

import BreakpointsButtons from '~core/component/BreakpointsButtons'
import WidthBar from '~core/component/WidthBar'
import HierarchyBar from '~core/full-ast/HierarchyBar'
import InteractiveModeButton from '~core/component/InteractiveModeButton'
import RemountButton from '~core/component/RemountButton'
// import EditCodeButton from '~core/component/EditCodeButton'
import ComponentWindow from '~core/component-window/ComponentWindow'
// import BottomTabsPanel from '~core/full-ast/BottomTabsPanel'
import RetractablePanel from '~core/layout/RetractablePanel'
import PanelHierarchy from '~core/full-ast/panels/PanelHierarchy'

function Component() {
  const { '*': ecuComponentPath = '' } = useParams()
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)

  const { tabs, setTabs } = useContext(TabsContext)

  const path = useCurrentComponentPath()

  const [componentFileMetadataQueryResult] = useQuery<ComponentFileQueryDataType>({
    query: ComponentFileMetadataQuery,
    variables: {
      path,
    },
    pause: !path,
  })

  // TODO useRefetch

  useEffect(() => {
    if (!ecuComponentPath) return

    const url = `/_ecu_/~/${ecuComponentPath}`

    if (tabs.some(tab => tab.url === url)) return

    setTabs(tabs => [...tabs, { url, label: path.split('/').pop() ?? '?' }])
  // Omitting tabs to trigger on ecuComponentPath change only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecuComponentPath, path, setTabs])

  if (!path) return null
  if (!componentFileMetadataQueryResult.data) return null

  const { decoratorPaths } = componentFileMetadataQueryResult.data.componentFileMetadata

  return (
    <Div
      xflex="x4s"
      flexGrow
      maxHeight="100%"
    >
      {!isInteractiveMode && (
        <RetractablePanel
          direction="left"
          openPersistedStateKey="left-panel-open"
          items={[
            {
              label: 'Hierarchy',
              icon: <RiNodeTree />,
              children: <PanelHierarchy />,
            },
          ]}
        />
      )}
      <Div
        xflex="y2s"
        flexGrow
        maxHeight="100%"
        overflow="hidden"
        backgroundColor="background-component"
      >
        <Div
          xflex="x4"
          height={32}
          backgroundColor="background-light"
          borderBottom="1px solid border"
        >
          <Div width={32 * 2} />
          <Div flexGrow />
          <BreakpointsButtons />
          <Div flexGrow />
          <InteractiveModeButton borderLeft="1px solid border" />
          <RemountButton borderLeft="1px solid border" />
          {/* <EditCodeButton /> */}
        </Div>
        <ComponentWindow
          componentPath={path}
          decoratorPaths={decoratorPaths}
        />
        <WidthBar />
        <HierarchyBar />
      </Div>
      {/* <Div
        position="absolute"
        bottom={0}
        left={0}
        right={0}
      >
        <BottomTabsPanel />
      </Div> */}
    </Div>
  )
}

export default Component
