import { useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'

import { ComponentFileMetadataQuery, ComponentFileQueryDataType } from '~queries'

import TabsContext from '~contexts/TabsContext'

import useQuery from '~hooks/useQuery'

import { convertFromEcuComponentPath } from '~utils/convertComponentPath'

import BreakpointsButtons from '~core/component/BreakpointsButtons'
import WidthBar from '~core/component/WidthBar'
import InteractiveModeButton from '~core/component/InteractiveModeButton'
import RemountButton from '~core/component/RemountButton'
import EditCodeButton from '~core/component/EditCodeButton'
import ComponentWindow from '~core/component-window/ComponentWindow'
import ProviderComponent from '~core/full-ast/ProviderComponent'
import BottomTabsPanel from '~core/full-ast/BottomTabsPanel'

function Component() {
  const { '*': ecuComponentPath = '' } = useParams()

  const { tabs, setTabs } = useContext(TabsContext)

  const path = useMemo(() => ecuComponentPath ? `/Users/sven/dev/ecu-app/app/src/${convertFromEcuComponentPath(ecuComponentPath)}` : '', [ecuComponentPath])

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
    <ProviderComponent>
      <Div
        xflex="x6"
        flexShrink={1}
      >
        <BreakpointsButtons />
        <InteractiveModeButton />
        <RemountButton />
        <EditCodeButton />
      </Div>
      <WidthBar />
      <ComponentWindow
        componentPath={path}
        decoratorPaths={decoratorPaths}
      />
      <BottomTabsPanel />
    </ProviderComponent>
  )
}

export default Component
