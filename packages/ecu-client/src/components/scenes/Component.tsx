import { useCallback, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Div, H3 } from 'honorable'
import { RiNodeTree } from 'react-icons/ri'
import { BiNetworkChart } from 'react-icons/bi'
import { CgInsertBeforeR } from 'react-icons/cg'
import { MdBrush } from 'react-icons/md'
import { BsDiamond } from 'react-icons/bs'

import { refetchKeys } from '../../constants'

import { ComponentQuery, ComponentQueryDataType } from '../../queries'

import IsInteractiveModeContext from '../../contexts/IsInteractiveModeContext'

import useQuery from '../../hooks/useQuery'
import useRefetch from '../../hooks/useRefetch'
import useIsComponentRefreshingQuery from '../../hooks/useIsComponentRefreshingQuery'

import ProviderComponent from '../core/ProviderComponent'
import ComponentWindow from '../core/ComponentWindow'
import RetractablePanel from '../core/RetractablePanel'
import PanelHierarchy from '../core/PanelHierarchy'
import PanelAddComponent from '../core/PanelAddComponent'
import PanelMetadata from '../core/PanelMetadata'
import PanelTypes from '../core/PanelTypes'
import PanelImports from '../core/PanelImports'
import PanelStyles from '../core/PanelStyles'
import HierarchyBar from '../core/HierarchyBar'
import WidthBar from '../core/WidthBar'

// Component scene
function Component() {
  const { componentAddress = '' } = useParams()
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)

  const [componentQueryResult, refetchComponentQuery] = useIsComponentRefreshingQuery(useQuery<ComponentQueryDataType>({
    query: ComponentQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    pause: !componentAddress,
  }))

  useRefetch(
    {
      key: refetchKeys.component,
      refetch: refetchComponentQuery,
      skip: !componentAddress,
    },
  )

  const renderNotFound = useCallback(() => (
    <Div
      flexGrow
      xflex="y2"
    >
      <H3 mt={1}>Component not found</H3>
      <Div my={1}>
        Either your app hash has changed or this component has been deleted.
      </Div>
      <Button
        as={Link}
        to="/_ecu_/components"
      >
        Back to components
      </Button>
    </Div>
  ), [])

  if (componentQueryResult.error) {
    return renderNotFound()
  }
  if (componentQueryResult.fetching && !componentQueryResult.data) {
    return <Div flexGrow />
  }
  if (!componentQueryResult.data?.component) {
    return renderNotFound()
  }

  const { component, decoratorPaths } = componentQueryResult.data.component

  if (!component) {
    return renderNotFound()
  }

  return (
    <ProviderComponent>
      <Div
        xflex="x4s"
        flexGrow
      >
        {!isInteractiveMode && (
          <RetractablePanel
            height="calc(100vh - 32px)"
            direction="left"
            openPersistedStateKey="left-panel-open"
            items={[
              {
                label: 'Hierarchy',
                icon: <RiNodeTree />,
                children: <PanelHierarchy />,
              },
              {
                label: 'Insert component',
                icon: <CgInsertBeforeR />,
                children: <PanelAddComponent />,
              },
            ]}
          />
        )}
        <Div
          xflex="y2s"
          flexGrow
          maxHeight="100%"
          overflow="hidden"
        >
          <ComponentWindow
            componentPath={component.payload.path}
            decoratorPaths={decoratorPaths}
          />
          <HierarchyBar />
          <WidthBar />
        </Div>
        {!isInteractiveMode && (
          <RetractablePanel
            height="calc(100vh - 32px)"
            direction="right"
            openPersistedStateKey="right-panel-open"
            items={[
              {
                label: 'Component',
                icon: <BsDiamond />,
                children: <PanelMetadata />,
              },
              {
                label: 'Imports and types',
                icon: <BiNetworkChart />,
                children: (
                  <>
                    <PanelImports />
                    <PanelTypes />
                  </>
                ),
              },
              {
                label: 'Styles',
                icon: <MdBrush />,
                children: <PanelStyles />,
              },
            ]}
          />
        )}
      </Div>
    </ProviderComponent>
  )
}

export default Component
