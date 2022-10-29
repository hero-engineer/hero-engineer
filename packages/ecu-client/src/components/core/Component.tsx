import { memo } from 'react'
import { useQuery } from 'urql'
import { useParams } from 'react-router-dom'
import { Div, H2, P } from 'honorable'

import { ComponentQuery } from '../../queries'

import ComponentEditor from './ComponentEditor'

function Component() {
  const { id } = useParams()
  const [componentQueryResult] = useQuery({
    query: ComponentQuery,
    variables: {
      id,
    },
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
      <H2 mt={2}>{component.payload.name}</H2>
      <P>{component.payload.relativePath}</P>
      <Div mt={2}>
        <ComponentEditor component={component} />
      </Div>
    </>
  )
}

export default memo(Component)
