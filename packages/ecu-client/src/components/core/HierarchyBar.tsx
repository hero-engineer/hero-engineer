import { Fragment, memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'
import { MdChevronRight } from 'react-icons/md'
import { VscTypeHierarchySub } from 'react-icons/vsc'

import { refetchKeys } from '../../constants'
import { HierarchyItemType } from '../../types'

import { HierarchyQuery, HierarchyQueryDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'

import usePreviousWithDefault from '../../hooks/usePreviousWithDefault'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useRefetch from '../../hooks/useRefetch'

import getFlattenedHierarchy from '../../helpers/getFlattenedHierarchy'

import areArraysEqual from '../../utils/areArraysEqual'

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
  const { shouldAdjustComponentDelta, setShouldAdjustComponentDelta, setHierarchy, setTotalHierarchy } = useContext(HierarchyContext)

  const [hierarchyQueryResult, refetchHierarchyQuery] = useQuery<HierarchyQueryDataType>({
    query: HierarchyQuery,
    variables: {
      sourceComponentAddress: componentAddress,
    },
    requestPolicy: 'network-only',
    pause: !componentAddress,
  })

  const refetch = useRefetch({
    key: refetchKeys.hierarchy,
    refetch: refetchHierarchyQuery,
    skip: !componentAddress,
  })

  const hierarchy = useMemo(() => JSON.parse(hierarchyQueryResult.data?.hierarchy || '""') || {}, [hierarchyQueryResult.data])
  const totalHierarchy = useMemo(() => getFlattenedHierarchy(hierarchy, hierarchyIds), [hierarchy, hierarchyIds])
  const actualHierarchy = useMemo(() => totalHierarchy.slice(0, totalHierarchy.length + componentDelta), [totalHierarchy, componentDelta])
  const previousHierarchy = usePreviousWithDefault(actualHierarchy, actualHierarchy)
  const displayHierarchy = useMemo(() => hierarchyIds.length ? shouldAdjustComponentDelta ? previousHierarchy : actualHierarchy : [], [hierarchyIds, shouldAdjustComponentDelta, previousHierarchy, actualHierarchy])

  const handleClick = useCallback((index: number) => {
    // console.log('___handleClick', actualHierarchy.map(x => x.label), index)

    // If clicked on a Component node link, ...
    if (actualHierarchy[index].componentAddress) {
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

      // console.log('totalHierarchy', totalHierarchy)
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
      if (actualHierarchy[i].hierarchyId) {
        nextHierarchyIds.push(actualHierarchy[i].hierarchyId as string)
      }
    }

    setEditionSearchParams({
      hierarchyIds: nextHierarchyIds,
      componentDelta: 0,
    })
  }, [actualHierarchy, totalHierarchy, setEditionSearchParams])

  useEffect(() => {
    setTotalHierarchy(totalHierarchy)
    setHierarchy(actualHierarchy)
  }, [totalHierarchy, actualHierarchy, setTotalHierarchy, setHierarchy])

  useEffect(() => {
    if (!shouldAdjustComponentDelta) return

    setShouldAdjustComponentDelta(false)

    // console.log('areArraysEqual(previousHierarchy, hierarchy)', areArraysEqual(previousHierarchy, actualHierarchy))

    if (areArraysEqual(previousHierarchy, actualHierarchy)) return

    const commonHierarchy: HierarchyItemType[] = []

    for (let i = 0; i < previousHierarchy.length; i++) {
      if (JSON.stringify(previousHierarchy[i]) === JSON.stringify(actualHierarchy[i])) {
        commonHierarchy.push(previousHierarchy[i])
      }
      else {
        break
      }
    }

    const workingHierarchyPart = totalHierarchy.slice(commonHierarchy.length, -1)
    const nextDelta = workingHierarchyPart.length ? getHierarchyDelta(workingHierarchyPart) : 0

    // console.log('previousHierarchy', previousHierarchy)
    // console.log('totalHierarchy', totalHierarchy)
    // console.log('commonHierarchy', commonHierarchy)
    // console.log('workingHierarchyPart', workingHierarchyPart)
    // console.log('nextDelta', nextDelta)

    setEditionSearchParams({
      componentDelta: nextDelta,
    })
  }, [shouldAdjustComponentDelta, totalHierarchy, previousHierarchy, actualHierarchy, setEditionSearchParams, setShouldAdjustComponentDelta])

  useEffect(() => {
    refetch(refetchKeys.componentScreenshot)
  }, [refetch, hierarchyQueryResult.data?.hierarchy])

  if (!componentAddress) {
    return null
  }

  return (
    <Div
      xflex="x4"
      fontSize={12}
      userSelect="none"
      gap={0.25}
      py={0.5}
    >
      {displayHierarchy.map(({ label, isChild }, i, a) => (
        <Fragment key={i + label}>
          <Div onClick={() => handleClick(i)}>
            {label}
          </Div>
          {i < a.length - 1 && (
            <MdChevronRight />
          )}
          {i === a.length - 1 && isChild && (
            <VscTypeHierarchySub
              size={12}
              title="Child"
            />
          )}
        </Fragment>
      ))}
      {displayHierarchy.length === 0 && (
        <Div visibility="hidden">
          -
        </Div>
      )}
    </Div>
  )
}

export default memo(HierarchyBar)
