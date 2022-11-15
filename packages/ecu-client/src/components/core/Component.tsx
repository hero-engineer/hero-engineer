import { memo } from 'react'
import { useQuery } from 'urql'
import { useParams } from 'react-router-dom'
import { Div, P } from 'honorable'

import { refetchKeys } from '../../constants'

import { ComponentQuery, ComponentQueryDataType } from '../../queries'

import useRefetch from '../../hooks/useRefetch'

import ComponentLoader from './ComponentLoader'
import DragAndDropEndModal from './DragAndDropEndModal'

function Component() {
  const { componentAddress = '' } = useParams()

  const [componentQueryResult, refetchComponentQuery] = useQuery<ComponentQueryDataType>({
    query: ComponentQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    pause: !componentAddress,
  })

  useRefetch({
    key: refetchKeys.component,
    refetch: refetchComponentQuery,
    skip: !componentAddress,
  })

  if (componentQueryResult.fetching) {
    return null
  }
  if (componentQueryResult.error) {
    return null
  }
  if (!componentQueryResult.data?.component) {
    return null
  }

  const { component } = componentQueryResult.data.component

  if (!component) {
    return null
  }

  return (
    <>
      <Div
        xflex="x4"
        gap={0.5}
      >
        <P fontWeight="bold">{component.payload.name}</P>
        <P
          color="text-light"
          fontSize={12}
        >
          {component.payload.relativePath}
        </P>
      </Div>
      <Div
        xflex="y2s"
        flexGrow={1}
        flexShrink={0}
        pt={1}
        pb={6}
      >
        <ComponentLoader component={component} />
      </Div>
      <DragAndDropEndModal />
    </>
  )
}

export default memo(Component)
