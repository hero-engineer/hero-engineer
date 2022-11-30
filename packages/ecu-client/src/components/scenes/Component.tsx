import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'
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

import ComponentProviders from '../core/ComponentProviders'
import ComponentWindow from '../core/ComponentWindow'

import HierarchyBar from '../core/HierarchyBar'
import RetractablePanel from '../core/RetractablePanel'
import HierarchySection from '../core/HierarchySection'
import AddComponentSection from '../core/AddComponentSection'
import ComponentMetadataSection from '../core/ComponentMetadataSection'
import ComponentTypesSection from '../core/ComponentTypesSection'
import ComponentImportsSection from '../core/ComponentImportsSection'
import StylesSection from '../core/StylesSection'
import WidthBar from '../core/WidthBar'

const placeholder = <Div flexGrow />

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

  if (componentQueryResult.error) {
    return placeholder
  }
  if (!componentQueryResult.data?.component) {
    return placeholder
  }

  const { component, decoratorPaths } = componentQueryResult.data.component

  if (!component) {
    return placeholder
  }

  return (
    <ComponentProviders>
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
                children: <HierarchySection />,
              },
              {
                label: 'Insert component',
                icon: <CgInsertBeforeR />,
                children: <AddComponentSection />,
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
                children: <ComponentMetadataSection />,
              },
              {
                label: 'Imports and types',
                icon: <BiNetworkChart />,
                children: (
                  <>
                    <ComponentImportsSection />
                    <ComponentTypesSection />
                  </>
                ),
              },
              {
                label: 'Styles',
                icon: <MdBrush />,
                children: <StylesSection />,
              },
            ]}
          />
        )}
      </Div>
    </ComponentProviders>
  )
}

export default Component
