import { memo, useCallback, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'

import EditionContext from '../../contexts/EditionContext'

import { HierarchyQuery } from '../../queries'

function HierarchyBar() {
  const { id = '' } = useParams()
  const { hierarchyIds, setHierarchyIds } = useContext(EditionContext)
  const [hierarchyQueryResult] = useQuery({
    query: HierarchyQuery,
    variables: {
      hierarchyIds,
      sourceComponentId: id,
    },
    pause: !(hierarchyIds.length && id),
  })
  const navigate = useNavigate()

  const handleClick = useCallback((hierarchy: any[], index: number) => {
    if (hierarchy[index].componentId) {
      navigate(`/__ecu__/component/${hierarchy[index].componentId}`)
    }
    else {
      const nextHierarchyIds: string[] = []

      for (let i = 0; i <= index; i++) {
        if (hierarchy[i].hierarchyId) {
          nextHierarchyIds.push(hierarchy[i].hierarchyId)
        }
      }

      setHierarchyIds(nextHierarchyIds)
    }
  }, [navigate, setHierarchyIds])

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

  const { hierarchy } = hierarchyQueryResult.data

  return (
    <Div
      xflex="x4"
      gap={0.5}
    >
      {(hierarchy as any[]).map(({ label }, i, a) => (
        <Div
          key={i}
          onClick={() => handleClick(a, i)}
        >
          {label}
        </Div>
      ))}
    </Div>
  )
}

export default memo(HierarchyBar)