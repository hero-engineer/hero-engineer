import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { ComponentFileQuery, ComponentFileQueryDataType } from '@queries'

import useQuery from '@hooks/useQuery'

import { convertFromEcuComponentPath } from '@utils/convertComponentPath'

import ComponentWindow from '@core/component-window/ComponentWindow'
import ProviderComponent from '@core/full-ast/ProviderComponent'
import WithComponentAst from '@core/full-ast/WithComponentAst'

function Component() {
  const { '*': ecuRelativePath = '' } = useParams()

  const relativePath = useMemo(() => convertFromEcuComponentPath(ecuRelativePath), [ecuRelativePath])

  const [componentFileQueryResult] = useQuery<ComponentFileQueryDataType>({
    query: ComponentFileQuery,
    variables: {
      relativePath,
    },
    pause: !relativePath,
  })

  if (!relativePath) return null
  if (!componentFileQueryResult.data) return null

  const { content, decoratorPaths } = componentFileQueryResult.data.componentFile

  return (
    <ProviderComponent>
      <WithComponentAst code={content}>
        <ComponentWindow
          componentPath={`/Users/sven/dev/ecu-app/app/src/${relativePath}`}
          decoratorPaths={decoratorPaths}
        />
      </WithComponentAst>
    </ProviderComponent>
  )
}

export default Component
