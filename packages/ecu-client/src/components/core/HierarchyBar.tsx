import { Fragment, memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'
import { MdChevronRight } from 'react-icons/md'

import { HierarchyItemType } from '../../types'

import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'
import HierarchyContext from '../../contexts/HierarchyContext'

import { HierarchyQuery } from '../../queries'

type HierarchyQueryReturnType = {
  hierarchy: {
    hierarchy: HierarchyItemType[],
    componentRootLimitedIds: string[],
  }
}

// import areArraysEqual from '../../utils/areArraysEqual'

// function usePreviousWithDeps<T>(value: T, deps: any[]) {
//   const ref = useRef<T>()

//   useEffect(() => {
//     ref.current = value
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, deps)

//   return ref.current
// }

function getMaxHierarchyDepth(hierarchy: HierarchyItemType[], hierarchyIds: string[]) {
  if (!hierarchy) return 0

  let maxDepth = 0

  for (let i = 0; i < hierarchy.length; i++) {
    const { hierarchyId } = hierarchy[i]

    if (!hierarchyId) maxDepth++
    else {
      if (hierarchyId === hierarchyIds[hierarchyIds.length - 1]) break

      maxDepth = 0
    }
  }

  return maxDepth
}

function getActualHierarchy(hierarchy: HierarchyItemType[] | undefined, hierarchyDepth: number, maxHierarchyDepth: number) {
  if (!hierarchy) return []

  const actualHierarchy = [...hierarchy]

  for (let i = hierarchyDepth; i < maxHierarchyDepth; i++) {
    actualHierarchy.pop()
  }

  return actualHierarchy
}

function HierarchyBar() {
  const { id = '' } = useParams()
  const { hierarchyIds, setHierarchyIds, componentRootLimitedIds, setComponentRootLimitedIds } = useContext(HierarchyIdsContext)
  const { setHierarchy, hierarchyDepth, setHierarchyDepth, maxHierarchyDepth, setMaxHierarchyDepth } = useContext(HierarchyContext)

  const [hierarchyQueryResult] = useQuery<HierarchyQueryReturnType>({
    query: HierarchyQuery,
    variables: {
      hierarchyIds,
      sourceComponentAddress: id,
    },
    pause: !id,
    requestPolicy: 'network-only',
  })

  const actualHierarchy = useMemo(() => getActualHierarchy(hierarchyQueryResult.data?.hierarchy?.hierarchy, hierarchyDepth, maxHierarchyDepth), [hierarchyQueryResult.data?.hierarchy?.hierarchy, hierarchyDepth, maxHierarchyDepth])

  const handleClick = useCallback((index: number) => {
    if (actualHierarchy[index].componentAddress) {
      setHierarchyDepth(actualHierarchy.length - index - 1)

      return
    }

    const nextHierarchyIds: string[] = []

    for (let i = 0; i <= index; i++) {
      if (actualHierarchy[i].hierarchyId) {
        nextHierarchyIds.push(actualHierarchy[i].hierarchyId as string)
      }
    }

    setHierarchyIds(nextHierarchyIds)
  }, [actualHierarchy, setHierarchyDepth, setHierarchyIds])

  useEffect(() => {
    if (!hierarchyQueryResult.data?.hierarchy) return

    const { hierarchy, componentRootLimitedIds } = hierarchyQueryResult.data.hierarchy

    setHierarchy(hierarchy)
    setMaxHierarchyDepth(getMaxHierarchyDepth(hierarchy, hierarchyIds))
    setComponentRootLimitedIds(componentRootLimitedIds)
  }, [hierarchyQueryResult.data, setHierarchy, setMaxHierarchyDepth, setComponentRootLimitedIds, hierarchyIds])

  // Prevent hierarchy depth overflow
  useEffect(() => {
    if (hierarchyDepth > maxHierarchyDepth) {
      setHierarchyDepth(maxHierarchyDepth)
    }
  }, [hierarchyDepth, maxHierarchyDepth, setHierarchyDepth])

  if (!id) {
    return null
  }

  if (hierarchyQueryResult.fetching) {
    return null
  }
  if (hierarchyQueryResult.error) {
    return null
  }
  if (!hierarchyQueryResult.data?.hierarchy) {
    return null
  }

  const { hierarchy } = hierarchyQueryResult.data.hierarchy

  if (!hierarchy.length) {
    return null
  }

  console.log('hierarchyIds', hierarchyIds)
  console.log('hierarchyDepth', hierarchyDepth, '/', maxHierarchyDepth)
  console.log('componentRootLimitedIds', componentRootLimitedIds)
  console.log('-->', actualHierarchy)

  return (
    <Div
      xflex="x4"
      fontSize={12}
      borderBottom="1px solid border"
      gap={0.25}
      p={0.5}
    >
      {actualHierarchy.map(({ label }, i, a) => (
        <Fragment key={i}>
          <Div onClick={() => handleClick(i)}>
            {label}
          </Div>
          {i < a.length - 1 && (
            <MdChevronRight />
          )}
        </Fragment>
      ))}
    </Div>
  )
}

export default memo(HierarchyBar)
