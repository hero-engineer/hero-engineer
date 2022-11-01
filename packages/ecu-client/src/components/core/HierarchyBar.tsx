import { memo, useCallback, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'

import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'
import HierarchyContext from '../../contexts/HierarchyContext'

import { HierarchyQuery } from '../../queries'

function HierarchyBar() {
  const { id = '' } = useParams()
  const { hierarchyIds, setHierarchyIds } = useContext(HierarchyIdsContext)
  const { setHierarchy } = useContext(HierarchyContext)
  const navigate = useNavigate()

  const [hierarchyQueryResult] = useQuery({
    query: HierarchyQuery,
    variables: {
      hierarchyIds,
      sourceComponentAddress: id,
    },
    pause: !id,
    requestPolicy: 'network-only',
  })

  const handleClick = useCallback((hierarchy: any[], index: number) => {
    if (hierarchy[index].componentAddress) {
      setHierarchyIds([])
      navigate(`/__ecu__/component/${hierarchy[index].componentAddress}`)

      return
    }

    const nextHierarchyIds: string[] = []

    for (let i = 0; i <= index; i++) {
      if (hierarchy[i].hierarchyId) {
        nextHierarchyIds.push(hierarchy[i].hierarchyId)
      }
    }

    setHierarchyIds(nextHierarchyIds)
  }, [navigate, setHierarchyIds])

  useEffect(() => {
    if (!hierarchyQueryResult.data) return
    if (!Array.isArray(hierarchyQueryResult.data.hierarchy)) return

    setHierarchy(hierarchyQueryResult.data.hierarchy)
  }, [hierarchyQueryResult.data, setHierarchy])

  if (!id) {
    return null
  }

  if (hierarchyQueryResult.fetching) {
    return null
  }
  if (hierarchyQueryResult.error) {
    return null
  }
  if (!hierarchyQueryResult.data) {
    return null
  }

  console.log('hierarchyIds', hierarchyIds)
  console.log('hierarchyQueryResult', hierarchyQueryResult.data.hierarchy)

  const { hierarchy } = hierarchyQueryResult.data

  if (!hierarchy.length) {
    return null
  }

  return (
    <Div
      xflex="x4"
      gap={0.5}
      py={0.5}
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
