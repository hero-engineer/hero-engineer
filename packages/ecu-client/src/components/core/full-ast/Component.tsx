import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'
import { RiNodeTree } from 'react-icons/ri'
import { MdBrush } from 'react-icons/md'

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
import ComponentWindow from '~core/component-window/ComponentWindow'
import RetractablePanel from '~core/layout/RetractablePanel'
import PanelHierarchy from '~core/full-ast/panels/PanelHierarchy'
import PanelStyles from '~core/full-ast/panels/styles/PanelStyles'

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
          backgroundColor="background-component"
        >
          <Div flexGrow />
          <Div width={128} />
          <InteractiveModeButton
            borderLeft="1px solid border"
            borderRight="1px solid border"
            borderBottom="1px solid border"
          />
          <RemountButton
            borderRight="1px solid border"
            borderBottom="1px solid border"
          />
          <Div width={32} />
          <BreakpointsButtons />
          <Div width={3 * 32} />
          <Div flexGrow />
        </Div>
        <ComponentWindow
          componentPath={path}
          decoratorPaths={decoratorPaths}
        />
        <WidthBar />
        <HierarchyBar />
      </Div>
      {!isInteractiveMode && (
        <RetractablePanel
          direction="right"
          openPersistedStateKey="right-panel-open"
          items={[
            {
              label: 'Style',
              icon: <MdBrush />,
              children: <PanelStyles />,
            },
          ]}
        />
      )}
    </Div>
  )
}

export default Component
