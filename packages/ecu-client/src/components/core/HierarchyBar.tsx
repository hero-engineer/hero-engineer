import { Fragment, memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'
import { MdChevronRight } from 'react-icons/md'

import { refetchKeys } from '../../constants'
import { HierarchyItemType } from '../../types'

import { HierarchyQuery, HierarchyQueryDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import BreakpointContext from '../../contexts/BreakpointContext'

import usePreviousWithDefault from '../../hooks/usePreviousWithDefault'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useRefetch from '../../hooks/useRefetch'

import getFlattenedHierarchy from '../../helpers/getFlattenedHierarchy'

function isSelectedComponentParent(hierarchy: HierarchyItemType[], currentHierarchyItem: HierarchyItemType) {
  const selectedHierarchyItem = hierarchy[hierarchy.length - 1]

  if (!selectedHierarchyItem) return false
  if (selectedHierarchyItem === currentHierarchyItem) return false

  const rightIndex = hierarchy.length - [...hierarchy].reverse().findIndex(x => x.componentName === currentHierarchyItem.componentName) - 1
  const currentIndex = hierarchy.indexOf(currentHierarchyItem)

  return rightIndex === currentIndex && selectedHierarchyItem.onComponentAddress === currentHierarchyItem.componentAddress
}

// The hierarchy bar component has 2 purposes:
// - Display the hierarchy of the current component
// - Update it
function HierarchyBar() {
  const { componentAddress = '' } = useParams()
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const { setHierarchy, setTotalHierarchy } = useContext(HierarchyContext)
  const { isDragging } = useContext(BreakpointContext)

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
  const displayHierarchy = useMemo(() => hierarchyIds.length ? actualHierarchy : [], [hierarchyIds, actualHierarchy])

  const handleClick = useCallback((index: number) => {
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
    setTotalHierarchy(hierarchy)
    setHierarchy(actualHierarchy)
  }, [hierarchy, actualHierarchy, setTotalHierarchy, setHierarchy])

  // Take a new screenshot when the hierarchy changes
  useEffect(() => {
    if (hierarchyQueryResult.fetching) return

    refetch(refetchKeys.componentScreenshot)
  }, [refetch, hierarchyQueryResult.fetching, hierarchyQueryResult.data?.hierarchy])

  if (!componentAddress) {
    return null
  }
  if (isDragging) {
    return null
  }

  return (
    <Div
      xflex="x4"
      flexShrink={0}
      height={30}
      fontSize="0.75rem"
      userSelect="none"
      backgroundColor="background-light"
      borderTop="1px solid border"
      gap={0.25}
      p={0.5}
    >
      {displayHierarchy.map((hierarchyItem, i, a) => (
        <Fragment key={i + hierarchyItem.label}>
          <Div
            onClick={() => handleClick(i)}
            textUnderlineOffset={1.5}
            textDecoration={isSelectedComponentParent(a, hierarchyItem) ? 'underline' : 'none'}
            title={isSelectedComponentParent(a, hierarchyItem) ? 'Parent of the seelected component' : undefined}
          >
            {hierarchyItem.label}
          </Div>
          {i < a.length - 1 && (
            <MdChevronRight />
          )}
        </Fragment>
      ))}
      {displayHierarchy.length === 0 && 'No element selected'}
    </Div>
  )
}

export default memo(HierarchyBar)
