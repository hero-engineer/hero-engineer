import { memo, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import EditionContext from '../../contexts/EditionContext'

import { HierarchyQuery } from '../../queries'

function HierarchyBar() {
  const { id = '' } = useParams()
  const { hierarchyIds } = useContext(EditionContext)
  const [hierarchyQueryResult] = useQuery({
    query: HierarchyQuery,
    variables: {
      hierarchyIds,
      sourceComponentId: id,
    },
    pause: !(hierarchyIds.length && id),
  })

  if (!id) {
    return null
  }

  if (hierarchyQueryResult.fetching) {
    return null
  }
  if (hierarchyQueryResult.error) {
    return null
  }

  console.log('hierarchyIds', hierarchyIds)
  console.log('hierarchyQueryResult', hierarchyQueryResult.data.hierarchy)

  return null
}

export default memo(HierarchyBar)
