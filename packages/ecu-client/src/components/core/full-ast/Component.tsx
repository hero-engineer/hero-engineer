import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'

import { ComponentFileMetadataQuery, ComponentFileQueryDataType } from '~queries'

import useQuery from '~hooks/useQuery'

import { convertFromEcuComponentPath } from '~utils/convertComponentPath'

import BreakpointsButtons from '~core/overlay/BreakpointsButtons'
import InteractiveModeButton from '~core/overlay/InteractiveModeButton'
import ComponentWindow from '~core/component-window/ComponentWindow'
import ProviderComponent from '~core/full-ast/ProviderComponent'

function Component() {
  const { '*': ecuRelativePath = '' } = useParams()

  const relativePath = useMemo(() => convertFromEcuComponentPath(ecuRelativePath), [ecuRelativePath])
  const path = useMemo(() => `/Users/sven/dev/ecu-app/app/src/${relativePath}`, [relativePath])

  const [componentFileMetadataQueryResult] = useQuery<ComponentFileQueryDataType>({
    query: ComponentFileMetadataQuery,
    variables: {
      path,
    },
    pause: !relativePath,
  })

  // TODO useRefetch

  if (!relativePath) return null
  if (!componentFileMetadataQueryResult.data) return null

  const { decoratorPaths } = componentFileMetadataQueryResult.data.componentFileMetadata

  return (
    <ProviderComponent>
      <Div xflex="x6">
        <BreakpointsButtons />
        <InteractiveModeButton />
      </Div>
      <ComponentWindow
        componentPath={`/Users/sven/dev/ecu-app/app/src/${relativePath}`}
        decoratorPaths={decoratorPaths}
      />
    </ProviderComponent>
  )
}

export default Component
