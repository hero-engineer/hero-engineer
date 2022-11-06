import { Fragment, memo, useCallback, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'
import { MdChevronRight } from 'react-icons/md'

import { HierarchyItemType } from '../../types'

import HierarchyContext from '../../contexts/HierarchyContext'

import usePreviousWithDefault from '../../hooks/usePreviousWithDefault'

import areArraysEqual from '../../utils/areArraysEqual'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'

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
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { hierarchy, totalHierarchy, shouldAdjustComponentDelta, setShouldAdjustComponentDelta } = useContext(HierarchyContext)

  const previousHierarchy = usePreviousWithDefault(hierarchy, hierarchy)

  // console.log('hierarchy', hierarchy)
  // console.log('hierarchy', hierarchy)

  const handleClick = useCallback((index: number) => {
    // console.log('___handleClick', hierarchy.map(x => x.label), index)

    // If clicked on a Component node link, ...
    if (hierarchy[index].componentAddress) {
      // Reduce the hierarchyIds to the closest next DOM node
      const nextHierarchyIds: string[] = []

      for (let i = 0; i < totalHierarchy.length; i++) {
        if (totalHierarchy[i].hierarchyId) {
          nextHierarchyIds.push(totalHierarchy[i].hierarchyId as string)

          if (i >= index) break
        }
      }

      const lastHierarchyId = nextHierarchyIds[nextHierarchyIds.length - 1]
      const nextComponentDelta = index - totalHierarchy.findIndex(x => x.hierarchyId === lastHierarchyId)

      // console.log('nextComponentDelta', nextComponentDelta)

      setEditionSearchParams({
        hierarchyIds: nextHierarchyIds,
        componentDelta: nextComponentDelta,
      })

      return
    }

    // If clicked on a DOM node link, reduce hierarchyIds
    const nextHierarchyIds: string[] = []

    for (let i = 0; i <= index; i++) {
      if (hierarchy[i].hierarchyId) {
        nextHierarchyIds.push(hierarchy[i].hierarchyId as string)
      }
    }

    setEditionSearchParams({
      hierarchyIds: nextHierarchyIds,
      componentDelta: 0,
    })
  }, [hierarchy, totalHierarchy, setEditionSearchParams])

  useEffect(() => {
    if (!shouldAdjustComponentDelta) return

    setShouldAdjustComponentDelta(false)

    // console.log('areArraysEqual(previousHierarchy, hierarchy)', areArraysEqual(previousHierarchy, hierarchy))

    if (areArraysEqual(previousHierarchy, hierarchy)) return

    const commonHierarchy: HierarchyItemType[] = []

    for (let i = 0; i < previousHierarchy.length; i++) {
      if (JSON.stringify(previousHierarchy[i]) === JSON.stringify(hierarchy[i])) {
        commonHierarchy.push(previousHierarchy[i])
      }
      else {
        break
      }
    }

    const workingHierarchyPart = totalHierarchy.slice(commonHierarchy.length, -1)
    const nextDelta = workingHierarchyPart.length ? getHierarchyDelta(workingHierarchyPart) : 0

    // console.log('commonHierarchy', commonHierarchy)
    // console.log('workingHierarchyPart', workingHierarchyPart)
    // console.log('nextDelta', nextDelta)

    setEditionSearchParams({
      componentDelta: nextDelta,
    })
  }, [shouldAdjustComponentDelta, totalHierarchy, previousHierarchy, hierarchy, setEditionSearchParams, setShouldAdjustComponentDelta])

  if (!componentAddress) {
    return null
  }

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
        {hierarchy.map(({ label }, i, a) => (
          <Fragment key={i + label}>
            <Div onClick={() => handleClick(i)}>
              {label}
            </Div>
            {i < a.length - 1 && (
              <MdChevronRight />
            )}
          </Fragment>
        ))}
        {hierarchy.length === 0 && (
          <Div visibility="hidden">
            -
          </Div>
        )}
        {/* {JSON.stringify(hierarchy, null, 2)} */}
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
        {/* {componentRootHierarchyIds.map(hierarchyId => (
          <Div
            key={hierarchyId}
            color="gold"
          >
            {hierarchyId}
            {', '}
          </Div>
        ))} */}
      </Div>
    </>
  )
}

export default memo(HierarchyBar)
