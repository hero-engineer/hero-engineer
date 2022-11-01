import { memo, useCallback, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'

import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'
import HierarchyContext from '../../contexts/HierarchyContext'

import { HierarchyQuery } from '../../queries'

// import areArraysEqual from '../../utils/areArraysEqual'

// function usePreviousWithDeps<T>(value: T, deps: any[]) {
//   const ref = useRef<T>()

//   useEffect(() => {
//     ref.current = value
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, deps)

//   return ref.current
// }

function getMaxHierarchyDepth(hierarchy: any[], hierarchyIds: string[]) {
  let maxDepth = 0

  console.log('hierarchyIds', hierarchyIds)

  for (let i = 0; i < hierarchy.length; i++) {
    console.log('hierarchy[i]', hierarchy[i])
    const { hierarchyId } = hierarchy[i]

    if (!hierarchyId) maxDepth++
    else {
      if (hierarchyId === hierarchyIds[hierarchyIds.length - 1]) break

      maxDepth = 0
    }
  }

  return maxDepth
}

function HierarchyBar() {
  const { id = '' } = useParams()
  const { hierarchyIds, setHierarchyIds, setComponentRootLimitedIds } = useContext(HierarchyIdsContext)
  const { setHierarchy, setMaxHierarchyDepth, maxHierarchyDepth } = useContext(HierarchyContext)
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

    const { hierarchy, componentRootLimitedIds } = hierarchyQueryResult.data.hierarchy

    setHierarchy(hierarchy)
    setMaxHierarchyDepth(getMaxHierarchyDepth(hierarchy, hierarchyIds))
    setComponentRootLimitedIds(componentRootLimitedIds)
  }, [hierarchyQueryResult.data, setHierarchy, setMaxHierarchyDepth, setComponentRootLimitedIds, hierarchyIds])

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

  // console.log('hierarchyIds', hierarchyIds)
  // console.log('hierarchyQueryResult', hierarchyQueryResult.data.hierarchy)

  const { hierarchy } = hierarchyQueryResult.data.hierarchy

  if (!hierarchy.length) {
    return null
  }

  console.log('maxHierarchyDepth', maxHierarchyDepth)

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
