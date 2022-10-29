import { memo } from 'react'
import { useQuery } from 'urql'
import { useParams } from 'react-router-dom'
import { H2, P } from 'honorable'

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

  return (
    <>
      <H2>{componentQueryResult.data.component.name}</H2>
      <P>{componentQueryResult.data.component.file.relativePath}</P>
      <ComponentEditor component={componentQueryResult.data.component} />
    </>
  )
}

export default memo(Component)
