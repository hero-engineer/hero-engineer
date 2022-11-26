import { useParams } from 'react-router-dom'

import { Div } from 'honorable'

import { refetchKeys } from '../../constants'

import { ComponentQuery, ComponentQueryDataType } from '../../queries'

import useRefetch from '../../hooks/useRefetch'
import useIsComponentRefreshingQuery from '../../hooks/useIsComponentRefreshingQuery'
import useQuery from '../../hooks/useQuery'

import ComponentWindow from '../core/ComponentWindow'

const placeholder = <Div flexGrow />

// Component scene
function Component() {
  const { componentAddress = '' } = useParams()

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
    <ComponentWindow
      componentPath={component.payload.path}
      decoratorPaths={decoratorPaths}
    />
  )
}

export default Component
