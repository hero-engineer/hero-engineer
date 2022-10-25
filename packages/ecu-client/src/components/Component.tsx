import { memo } from 'react'
import { useQuery } from 'urql'
import { useParams } from 'react-router-dom'

import { ComponentQuery } from '../queries'

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
      <h2>{componentQueryResult.data.component.name}</h2>
      <p>{componentQueryResult.data.component.file.relativePath}</p>
      <ComponentEditor component={componentQueryResult.data.component} />
    </>
  )
}

export default memo(Component)
