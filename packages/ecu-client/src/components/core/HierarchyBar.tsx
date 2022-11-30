import { Fragment, memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'
import { Div } from 'honorable'

import { refetchKeys, zIndexes } from '../../constants'
import { HierarchyItemType } from '../../types'

import { HierarchyQuery, HierarchyQueryDataType } from '../../queries'

import HierarchyContext from '../../contexts/HierarchyContext'
import BreakpointContext from '../../contexts/BreakpointContext'
import EditionContext from '../../contexts/EditionContext'
import LastEditedComponentContext from '../../contexts/LastEditedComponentContext'
import IsInteractiveModeContext from '../../contexts/IsInteractiveModeContext'

import useRefetch from '../../hooks/useRefetch'

import getFlattenedHierarchy from '../../utils/getFlattenedHierarchy'
import findHierarchyIdsAndComponentDelta from '../../utils/findHierarchyIdsAndComponentDelta'

function isSelectedComponentParent(hierarchy: HierarchyItemType[], currentHierarchyItem: HierarchyItemType) {
  const selectedHierarchyItem = hierarchy[hierarchy.length - 1]

  if (!selectedHierarchyItem) return false
  if (selectedHierarchyItem === currentHierarchyItem) return false

  const rightIndex = hierarchy.length - [...hierarchy].reverse().findIndex(x => x.componentName === currentHierarchyItem.componentName) - 1
  const currentIndex = hierarchy.indexOf(currentHierarchyItem)

  return rightIndex === currentIndex && selectedHierarchyItem.onComponentAddress === currentHierarchyItem.componentAddress
}

const height = 31
const caretSize = Math.sqrt(height ** 2 / 2)

// The hierarchy bar component has 2 purposes:
// - Display the hierarchy of the current component
// - Update it
function HierarchyBar() {
  const { componentAddress = '' } = useParams()
  const { hierarchyId, componentDelta, setHierarchyId, setComponentDelta } = useContext(EditionContext)
  const { setHierarchy, setTotalHierarchy } = useContext(HierarchyContext)
  const { isDragging } = useContext(BreakpointContext)
  const { lastEditedComponent, setLastEditedComponent } = useContext(LastEditedComponentContext)
  const { isInteractiveMode } = useContext(IsInteractiveModeContext)

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

  const hierarchy = useMemo<HierarchyItemType>(() => JSON.parse(hierarchyQueryResult.data?.hierarchy || '""') || {}, [hierarchyQueryResult.data])
  const totalHierarchy = useMemo(() => getFlattenedHierarchy(hierarchy, hierarchyId), [hierarchy, hierarchyId])
  const actualHierarchy = useMemo(() => totalHierarchy.slice(0, totalHierarchy.length + componentDelta), [totalHierarchy, componentDelta])

  const handleClick = useCallback((hierarchyItem: HierarchyItemType) => {
    const found = findHierarchyIdsAndComponentDelta(hierarchy, hierarchyItem)

    if (found) {
      setHierarchyId(found.hierarchyIds[0])
      setComponentDelta(found.componentDelta)
    }
  }, [hierarchy, setHierarchyId, setComponentDelta])

  useEffect(() => {
    setTotalHierarchy(hierarchy)
    setHierarchy(actualHierarchy)
  }, [hierarchy, actualHierarchy, setTotalHierarchy, setHierarchy])

  // Take a new screenshot when the hierarchy changes
  useEffect(() => {
    if (hierarchyQueryResult.fetching) return

    refetch(refetchKeys.componentScreenshot)
  }, [hierarchyQueryResult.fetching, hierarchyQueryResult.data?.hierarchy, refetch])

  useEffect(() => {
    if (!Object.keys(hierarchy).length) return

    const nextLastEditedCompoment = { ...hierarchy }

    if (nextLastEditedCompoment.id === nextLastEditedCompoment.id) return

    // @ts-expect-error
    delete nextLastEditedCompoment.children

    setLastEditedComponent(nextLastEditedCompoment)
    setHierarchyId('')
    setComponentDelta(0)
  }, [hierarchy, lastEditedComponent, setLastEditedComponent, setHierarchyId, setComponentDelta])

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
      height={height}
      fontSize="0.75rem"
      userSelect="none"
      backgroundColor="background-light"
      borderTop="1px solid border"
      gap={0.25}
      px={0.5}
    >
      {!isInteractiveMode && actualHierarchy.map((hierarchyItem, i, a) => (
        <Fragment key={i + hierarchyItem.label}>
          <Div
            xflex="x4"
            onClick={() => handleClick(hierarchyItem)}
            textUnderlineOffset={3}
            textDecoration={isSelectedComponentParent(a, hierarchyItem) ? 'underline' : 'none'}
            title={isSelectedComponentParent(a, hierarchyItem) ? 'Parent of the seelected component' : undefined}
            cursor="pointer"
            zIndex={zIndexes.hierarchyBarItem + 1}
          >
            {hierarchyItem.label}
          </Div>
          {i < a.length - 1 && (
            <Div
              borderTop="1px solid border"
              borderRight="1px solid border"
              width={caretSize}
              height={caretSize}
              transform="scaleX(0.75) rotate(45deg)"
              transformOrigin="center"
              ml={`${-caretSize / 2}px`}
              mr={0.25}
              zIndex={zIndexes.hierarchyBarItem}
            />
          )}
        </Fragment>
      ))}
      {!isInteractiveMode && actualHierarchy.length === 0 && 'No element selected'}
      {isInteractiveMode && 'Interactive mode'}
    </Div>
  )
}

export default memo(HierarchyBar)
