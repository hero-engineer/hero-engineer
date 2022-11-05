import { Fragment, memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'
import { MdChevronRight } from 'react-icons/md'

import { HierarchyItemType } from '../../types'

import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'
import HierarchyContext from '../../contexts/HierarchyContext'

import { HierarchyQuery } from '../../queries'

import usePreviousWithDefault from '../../hooks/usePreviousWithDefault'

import getActualHierarchy from '../../helpers/getActualHierarchy'

import areArraysEqual from '../../utils/areArraysEqual'

type HierarchyQueryReturnType = {
  hierarchy: HierarchyItemType[]
}

type HierarchyMetadataQueryReturnType = {
  hierarchyMetadata: {
    isHierarchyOnComponent: boolean
    componentRootHierarchyIds: string[]
  }
}

function getHierarchyDelta(hierarchy: HierarchyItemType[]) {
  let delta = 0

  hierarchy.forEach(x => {
    if (x.hierarchyId) delta = 0
    else delta--
  })

  return delta
}

function HierarchyBar() {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, setHierarchyIds, componentRootHierarchyIds, setComponentRootHierarchyIds } = useContext(HierarchyIdsContext)
  const { hierarchy, componentDelta, setComponentDelta, shouldAdjustComponentDelta, setShouldAdjustComponentDelta } = useContext(HierarchyContext)

  // const [hierarchyQueryResult] = useQuery<HierarchyQueryReturnType>({
  //   query: HierarchyQuery,
  //   variables: {
  //     hierarchyIds,
  //     sourceComponentAddress: id,
  //   },
  //   pause: !id,
  //   requestPolicy: 'network-only',
  // })

  // const [hierarchyMetadataQueryResult] = useQuery<HierarchyMetadataQueryReturnType>({
  //   query: HierarchyMetadataQuery,
  //   variables: {
  //     hierarchyIds,
  //     componentDelta,
  //     sourceComponentAddress: id,
  //   },
  //   pause: true || !id || shouldAdjustComponentDelta,
  //   requestPolicy: 'network-only',
  // })

  // const hierarchy = useMemo(() => hierarchyQueryResult.data?.hierarchy || [], [hierarchyQueryResult.data?.hierarchy])
  // const actualHierarchy = useMemo(() => getActualHierarchy(hierarchy, componentDelta), [hierarchy, componentDelta])
  // const previousHierarchy = usePreviousWithDefault(actualHierarchy, actualHierarchy)

  const handleClick = useCallback((index: number) => {
    // console.log('___handleClick', actualHierarchy.map(x => x.label), index)

    // If clicked on a Component node link, ...
    // if (actualHierarchy[index].componentAddress) {
    //   // Reduce the hierarchyIds to the closest next DOM node
    //   const nextHierarchyIds: string[] = []

    //   for (let i = 0; i < hierarchy.length; i++) {
    //     if (hierarchy[i].hierarchyId) {
    //       nextHierarchyIds.push(hierarchy[i].hierarchyId as string)

    //       if (i >= index) break
    //     }
    //   }

    //   const lastHierarchyId = nextHierarchyIds[nextHierarchyIds.length - 1]
    //   // console.log('nextHierarchyIds', nextHierarchyIds)

    //   // console.log('actualHierarchy.findIndex(x => x.hierarchyId === lastHierarchyId)', hierarchy.findIndex(x => x.hierarchyId === lastHierarchyId))
    //   const nextComponentDelta = index - hierarchy.findIndex(x => x.hierarchyId === lastHierarchyId)

    //   // console.log('nextComponentDelta', nextComponentDelta)

    //   setHierarchyIds(nextHierarchyIds)
    //   setComponentDelta(nextComponentDelta)

    //   return
    // }

    // // If clicked on a DOM node link, reduce hierarchyIds
    // const nextHierarchyIds: string[] = []

    // for (let i = 0; i <= index; i++) {
    //   if (actualHierarchy[i].hierarchyId) {
    //     nextHierarchyIds.push(actualHierarchy[i].hierarchyId as string)
    //   }
    // }

    // setHierarchyIds(nextHierarchyIds)
    // setComponentDelta(0)
  }, [])

  // useEffect(() => {
  //   if (!shouldAdjustComponentDelta) return
  //   if (areArraysEqual(previousHierarchy, actualHierarchy)) return

  //   const commonHierarchy: HierarchyItemType[] = []

  //   for (let i = 0; i < previousHierarchy.length; i++) {
  //     if (JSON.stringify(previousHierarchy[i]) === JSON.stringify(actualHierarchy[i])) {
  //       commonHierarchy.push(previousHierarchy[i])
  //     }
  //     else {
  //       break
  //     }
  //   }

  //   const workingHierarchyPart = hierarchy.slice(commonHierarchy.length, -1)
  //   const nextDelta = workingHierarchyPart.length ? getHierarchyDelta(workingHierarchyPart) : 0

  //   setComponentDelta(nextDelta)
  //   setShouldAdjustComponentDelta(false)
  // }, [shouldAdjustComponentDelta, hierarchy, previousHierarchy, actualHierarchy, setComponentDelta, setShouldAdjustComponentDelta])

  if (!componentAddress) {
    return null
  }
  // if (hierarchyQueryResult.error) {
  //   return null
  // }

  return (
    <>
      <Div
        xflex="x4"
        fontSize={12}
        borderBottom="1px solid border"
        userSelect="none"
        gap={0.25}
        p={0.5}
        whiteSpace="pre"
      >
        {/* {actualHierarchy.map(({ label }, i, a) => (
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
        )} */}
        {JSON.stringify(hierarchy, null, 2)}
      </Div>
      <Div
        xflex="x4"
        fontSize={12}
        gap={0.25}
        p={0.5}
      >
        {/* {isHierarchyOnComponent ? 'on component' : 'not on component'} */}
        {/* {' / '} */}
        {componentDelta}
        {' --> '}
        {hierarchyIds.map(hierarchyId => (
          <Div key={hierarchyId}>
            {hierarchyId}
            {' -->'}
          </Div>
        ))}
        {' / '}
        {componentRootHierarchyIds.map(hierarchyId => (
          <Div
            key={hierarchyId}
            color="gold"
          >
            {hierarchyId}
            {', '}
          </Div>
        ))}
      </Div>
    </>
  )
}

export default memo(HierarchyBar)
