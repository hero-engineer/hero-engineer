import { memo } from 'react'
import { useQuery } from 'urql'
import { useParams } from 'react-router-dom'
import { Div, P } from 'honorable'

import { ComponentQuery } from '../../queries'

import ComponentLoader from './ComponentLoader'
import DragAndDropEndModal from './DragAndDropEndModal'

function Component() {
  const { componentAddress = '' } = useParams()

  const [componentQueryResult] = useQuery({
    query: ComponentQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    pause: !componentAddress,
  })

  if (componentQueryResult.fetching) {
    return null
  }
  if (componentQueryResult.error) {
    return null
  }
  if (!componentQueryResult.data.component) {
    return null
  }

  const { component } = componentQueryResult.data

  return (
    <>
      <P fontWeight="bold">{component.payload.name}</P>
      <P>{component.payload.relativePath}</P>
      <Div
        xflex="y2s"
        flexGrow={1}
        flexShrink={0}
        mt={2}
        pb={6}
      >
        <ComponentLoader component={component} />
      </Div>
      <DragAndDropEndModal />
    </>
  )
}

export default memo(Component)
