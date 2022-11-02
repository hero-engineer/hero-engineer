import { Fragment, memo, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'
import { MdChevronRight } from 'react-icons/md'

import { HierarchyItemType } from '../../types'

import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'
import HierarchyContext from '../../contexts/HierarchyContext'

import usePreviousWithDefault from '../../hooks/usePreviousWithDefault'

import areArraysEqual from '../../utils/areArraysEqual'
import countArraysStartEquality from '../../utils/countArraysStartEquality'

import { HierarchyQuery } from '../../queries'
import splitArray from '../../utils/splitArray'

type HierarchyQueryReturnType = {
  hierarchy: {
    hierarchy: HierarchyItemType[],
    componentRootLimitedIds: string[],
  }
}

function getMaxHierarchyDepth(hierarchy: HierarchyItemType[]) {
  if (!hierarchy) return 0

  let maxDepth = 0

  for (let i = 0; i < hierarchy.length; i++) {
    const { hierarchyId } = hierarchy[i]

    if (!hierarchyId) maxDepth++
    else {
      if (i === hierarchy.length - 1) break

      maxDepth = 0
    }
  }

  return maxDepth
}

function splitHierarchy(hierarchy: HierarchyItemType[], cursor: number) {
  const a = []
  const b = []

  for (let i = 0; i < hierarchy.length; i++) {
    a.push(hierarchy[i])

    if (hierarchy[i].hierarchyId && i >= cursor) break
  }

  for (let i = a.length; i < hierarchy.length; i++) {
    b.push(hierarchy[i])
  }

  return [a, b]
}

function getHierarchyComponentRootOffset(hierarchy: HierarchyItemType[], cursor: number) {
  let offset = 0

  for (let i = 0; i < cursor; i++) {
    if (hierarchy[i].hierarchyId) offset = hierarchy[i - 1]?.hierarchyId ? offset + 1 : 1
  }

  return offset
}

function getActualHierarchy(hierarchy: HierarchyItemType[], componentDelta: number) {
  return hierarchy.slice(0, hierarchy.length + componentDelta)
}

function HierarchyBar() {
  const { id = '' } = useParams()
  const { hierarchyIds, setHierarchyIds, setComponentRootLimitedIds, componentRootLimitedIds } = useContext(HierarchyIdsContext)
  const { setHierarchy, componentDelta, setComponentDelta } = useContext(HierarchyContext)
  // const [preventIncrementingHierarchyDepth, setPreventIncrementingHierarchyDepth] = useState(false)

  const [hierarchyQueryResult] = useQuery<HierarchyQueryReturnType>({
    query: HierarchyQuery,
    variables: {
      hierarchyIds,
      sourceComponentAddress: id,
    },
    pause: !id,
    requestPolicy: 'network-only',
  })

  const previousHierarchyIds = usePreviousWithDefault(hierarchyIds, [])
  const actualHierarchy = useMemo(() => getActualHierarchy(hierarchyQueryResult.data?.hierarchy?.hierarchy || [], componentDelta), [hierarchyQueryResult.data?.hierarchy?.hierarchy, componentDelta])
  const previousHierarchy = usePreviousWithDefault(actualHierarchy, actualHierarchy)

  const handleClick = useCallback((index: number) => {
    console.log('___handleClick', actualHierarchy.map(x => x.label), index)

    // If clicked on a Component node link, ...
    if (actualHierarchy[index].componentAddress) {
      // Reduce the hierarchyIds to the closest next DOM node
      const nextHierarchyIds: string[] = []

      for (let i = 0; i < actualHierarchy.length; i++) {
        if (actualHierarchy[i].hierarchyId) {
          nextHierarchyIds.push(actualHierarchy[i].hierarchyId as string)

          if (i >= index) break
        }
      }

      const lastHierarchyId = nextHierarchyIds[nextHierarchyIds.length - 1]
      const nextComponentDelta = index - actualHierarchy.findIndex(x => x.hierarchyId === lastHierarchyId)

      console.log('nextHierarchyIds', nextComponentDelta)

      setHierarchyIds(nextHierarchyIds)
      setComponentDelta(nextComponentDelta)

      return
    }

    // If clicked on a DOM node link, reduce hierarchyIds
    const nextHierarchyIds: string[] = []

    for (let i = 0; i <= index; i++) {
      if (actualHierarchy[i].hierarchyId) {
        nextHierarchyIds.push(actualHierarchy[i].hierarchyId as string)
      }
    }

    console.log('nextHierarchyIds', nextHierarchyIds)

    setHierarchyIds(nextHierarchyIds)
    setComponentDelta(0)
  }, [actualHierarchy, setHierarchyIds, setComponentDelta])

  useEffect(() => {
    if (!hierarchyQueryResult.data?.hierarchy) return

    const { hierarchy, componentRootLimitedIds } = hierarchyQueryResult.data.hierarchy
    // const nextMaxHierarchyDepth = getMaxHierarchyDepth(hierarchy)

    setHierarchy(hierarchy)
    // setMaxHierarchyDepth(nextMaxHierarchyDepth)
    setComponentRootLimitedIds(componentRootLimitedIds)
  }, [hierarchyQueryResult.data, setHierarchy, setComponentRootLimitedIds])

  // useEffect(() => {
  //   // console.log('Effect', areArraysEqual(previousHierarchyIds, hierarchyIds), previousHierarchyIds, hierarchyIds)
  //   // console.log('xxx', xxx)
  //   // console.log('countArraysStartEquality(previousHierarchyIds, hierarchyIds)', countArraysStartEquality(previousHierarchyIds, hierarchyIds))
  //   // setHierarchyDepth(x => areArraysEqual(previousHierarchyIds, hierarchyIds) ? Math.min(maxHierarchyDepth, x + 1) : 0)
  // // previousHierarchyIds removed on purpose
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [hierarchyIds, maxHierarchyDepth, setHierarchyDepth])

  if (!id) {
    return null
  }
  if (hierarchyQueryResult.error) {
    return null
  }

  // console.log('hierarchyDepth', hierarchyDepth, '/', maxHierarchyDepth)
  // console.log('componentRootLimitedIds', componentRootLimitedIds)
  // // console.log('componentRootLimitedIds', componentRootLimitedIds)
  // console.log('-->', actualHierarchy.map(x => x.label))

  return (
    <>
      <Div
        xflex="x4"
        fontSize={12}
        borderBottom="1px solid border"
        userSelect="none"
        gap={0.25}
        p={0.5}
      >
        {actualHierarchy.map(({ label }, i, a) => (
          <Fragment key={i + label}>
            <Div onClick={() => handleClick(i)}>
              {label}
            </Div>
            {i < a.length - 1 && (
              <MdChevronRight />
            )}
          </Fragment>
        ))}
        {actualHierarchy.length === 0 && (
          <Div visibility="hidden">
            -
          </Div>
        )}
      </Div>
      <Div
        xflex="x4"
        fontSize={12}
        gap={0.25}
        p={0.5}
      >
        {componentDelta}
        {' --> '}
        {hierarchyIds.map(hierarchyId => (
          <Div key={hierarchyId}>
            {hierarchyId}
            {' -->'}
          </Div>
        ))}
      </Div>
    </>
  )
}

export default memo(HierarchyBar)
