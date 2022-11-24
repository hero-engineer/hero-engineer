import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { A, Button, Div, H3, Menu, MenuItem, Modal, P, WithOutsideClick } from 'honorable'

import { SlTrash } from 'react-icons/sl'

import { HierarchyPosition } from '../../types'
import { refetchKeys } from '../../constants'

import HierarchyContext from '../../contexts/HierarchyContext'
import ContextualInformationContext from '../../contexts/ContextualInformationContext'
import DragAndDropContext from '../../contexts/DragAndDropContext'

import { DeleteComponentMutation, DeleteComponentMutationDataType, MoveComponentMutation, MoveComponentMutationDataType } from '../../queries'

import useRefetch from '../../hooks/useRefetch'
import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useIsComponentRefreshingMutation from '../../hooks/useIsComponentRefreshingMutation'
import useMutation from '../../hooks/useMutation'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'
import getLastEditedHierarchyItem from '../../helpers/getLastEditedHierarchyItem'

// Displays:
// - the context menu on component
// - the component name vignette
// - the component drop vignette
function ContextualInformation() {
  const { componentAddress = '' } = useParams()
  const contextualMenuRef = useRef<HTMLDivElement>(null)
  const { hierarchy } = useContext(HierarchyContext)
  const { contextualInformationState, setContextualInformationState } = useContext(ContextualInformationContext)
  const { dragAndDrop, setDragAndDrop } = useContext(DragAndDropContext)
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()

  const [isComponentNameVignetteVisible, setIsComponentNameVignetteVisible] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const navigate = useNavigate()

  const lastHierarchyItem = useMemo(() => hierarchy[hierarchy.length - 1], [hierarchy])
  const lastEditedHierarchyItem = useMemo(() => getLastEditedHierarchyItem(hierarchy), [hierarchy])

  const [, moveComponent] = useIsComponentRefreshingMutation(useMutation<MoveComponentMutationDataType>(MoveComponentMutation))
  const [, deleteComponent] = useIsComponentRefreshingMutation(useMutation<DeleteComponentMutationDataType>(DeleteComponentMutation))

  const refetch = useRefetch()

  const closeContextMenu = useCallback(() => {
    setContextualInformationState(x => ({ ...x, rightClickEvent: null }))
  }, [setContextualInformationState])

  const handleDeleteComponentClick = useCallback(async () => {
    closeContextMenu()

    if (!isHierarchyOnComponent(hierarchy, componentAddress)) {
      setIsDeleteModalOpen(true)

      return
    }

    await deleteComponent({
      sourceComponentAddress: componentAddress,
      targetHierarchyId: hierarchyIds[hierarchyIds.length - 1],
      componentDelta,
    })

    setEditionSearchParams({
      hierarchyIds: [],
      componentDelta: 0,
    })

    setContextualInformationState(x => ({ ...x, element: null }))

    refetch(refetchKeys.hierarchy)
  }, [
    closeContextMenu,
    hierarchy,
    componentDelta,
    componentAddress,
    deleteComponent,
    hierarchyIds,
    setEditionSearchParams,
    setContextualInformationState,
    refetch,
  ])

  const navigateToLastEditedComponent = useCallback(() => {
    setIsDeleteModalOpen(false)

    navigate(`/_ecu_/component/${lastEditedHierarchyItem?.componentAddress}`)
  }, [navigate, lastEditedHierarchyItem])

  const readElementPosition = useCallback(() => {
    if (!contextualInformationState.element) return null

    const rect = contextualInformationState.element.getBoundingClientRect()

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    }
  }, [contextualInformationState.element])

  const readDropElementPosition = useCallback(() => {
    if (!contextualInformationState.dropElement) return null

    const rect = contextualInformationState.dropElement.getBoundingClientRect()

    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    }
  }, [contextualInformationState.dropElement])

  const handleMove = useCallback(async (hierarchyPosition: HierarchyPosition) => {

  }, [])

  // Reset drag and drop on Escape key
  const handleWindowKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDragAndDrop({
        sourceHierarchyId: '',
        targetHierarchyId: '',
        sourceComponentDelta: 0,
        targetComponentDelta: 0,
      })
      setContextualInformationState(x => ({ ...x, dropElement: null }))
    }
  }, [setDragAndDrop, setContextualInformationState])

  const renderContextMenu = useCallback(() => {
    if (!contextualInformationState.rightClickEvent) return null

    const { pageX, pageY } = contextualInformationState.rightClickEvent

    return (
      <WithOutsideClick
        onOutsideClick={closeContextMenu}
      >
        <Menu
          ref={contextualMenuRef}
          position="fixed"
          top={pageY}
          left={pageX}
        >
          <MenuItem
            value="delete"
            onClick={handleDeleteComponentClick}
          >
            <Div
              xflex="x4"
              gap={0.5}
            >
              <SlTrash />
              Delete component
            </Div>
          </MenuItem>
        </Menu>
      </WithOutsideClick>
    )
  }, [
    contextualInformationState.rightClickEvent,
    closeContextMenu,
    handleDeleteComponentClick,
  ])

  const renderComponentVignette = useCallback(() => {
    if (!contextualInformationState.element) return
    if (!(lastHierarchyItem && isComponentNameVignetteVisible) || componentDelta > 0) return null

    const elementRect = readElementPosition()

    if (!elementRect) return null

    return (
      <Div
        xflex="x4"
        position="fixed"
        top={`calc(${elementRect.y}px - 16px)`}
        left={`calc(${elementRect.x}px - 1px)`}
        height={16}
        backgroundColor={contextualInformationState.isEdited ? 'is-edited' : contextualInformationState.isComponentRoot ? 'is-component-root' : 'primary'}
        color="white"
        fontSize={12}
        zIndex={999999}
        userSelect="none"
        px={0.25}
      >
        {lastHierarchyItem.displayName ? `${lastHierarchyItem.displayName} [${lastHierarchyItem.componentName}]` : lastHierarchyItem.componentName}
      </Div>
    )
  }, [
    lastHierarchyItem,
    isComponentNameVignetteVisible,
    componentDelta,
    readElementPosition,
    contextualInformationState.element,
    contextualInformationState.isEdited,
    contextualInformationState.isComponentRoot,
  ])

  const renderDropVignette = useCallback(() => {
    if (!contextualInformationState.dropElement) return null
    if (!(dragAndDrop.sourceHierarchyId && dragAndDrop.targetHierarchyId)) return null

    const dropElementRect = readDropElementPosition()

    if (!dropElementRect) return null

    return (
      <Div
        xflex="x4"
        position="fixed"
        top={`calc(${dropElementRect.y + dropElementRect.height}px - 1px)`}
        left={`calc(${dropElementRect.x}px - 1px)`}
        height={16}
        backgroundColor="is-drop"
        color="white"
        fontSize={12}
        zIndex={999999}
        userSelect="none"
        gap={0.5}
        px={0.25}
      >
        <Div>
          Drop:
        </Div>
        <A
          color="inherit"
          onClick={() => handleMove('before')}
        >
          Before
        </A>
        <A
          color="inherit"
          onClick={() => handleMove('after')}
        >
          After
        </A>
        <A
          color="inherit"
          onClick={() => handleMove('children')}
        >
          Children
        </A>
      </Div>
    )
  }, [
    dragAndDrop.sourceHierarchyId,
    dragAndDrop.targetHierarchyId,
    contextualInformationState.dropElement,
    readDropElementPosition,
    handleMove,
  ])

  // useEffect(() => {
  //   if (!scrollRef.current) return

  //   const scrollElement = scrollRef.current

  //   readElementPosition()

  //   window.addEventListener('resize', readElementPosition)
  //   window.addEventListener('scroll', readElementPosition)
  //   scrollElement.addEventListener('scroll', readElementPosition)

  //   const resizeObserver = new ResizeObserver(readElementPosition)

  //   resizeObserver.observe(scrollElement)

  //   return () => {
  //     window.removeEventListener('resize', readElementPosition)
  //     window.removeEventListener('scroll', readElementPosition)

  //     scrollElement.removeEventListener('scroll', readElementPosition)

  //     resizeObserver.disconnect()
  //   }
  // }, [readElementPosition, scrollRef])

  // useEffect(() => {
  //   if (!scrollRef.current) return

  //   const scrollElement = scrollRef.current

  //   readDropElementPosition()

  //   window.addEventListener('resize', readDropElementPosition)
  //   window.addEventListener('scroll', readDropElementPosition)
  //   scrollElement.addEventListener('scroll', readDropElementPosition)

  //   const resizeObserver = new ResizeObserver(readDropElementPosition)

  //   resizeObserver.observe(scrollElement)

  //   return () => {
  //     window.removeEventListener('resize', readDropElementPosition)
  //     window.removeEventListener('scroll', readDropElementPosition)

  //     scrollElement.removeEventListener('scroll', readDropElementPosition)

  //     resizeObserver.disconnect()
  //   }
  // }, [readDropElementPosition, scrollRef])

  // useEffect(() => {
  //   if (!scrollRef.current) return
  //   if (!contextualInformationState.element) return

  //   const observer = new window.IntersectionObserver(([entry]) => {
  //     setIsComponentNameVignetteVisible(entry.isIntersecting)
  //   }, {
  //     root: scrollRef.current,
  //     threshold: 0,
  //     rootMargin: '-16px 0px 0px 0px',
  //   })

  //   observer.observe(contextualInformationState.element)

  //   return () => {
  //     observer.disconnect()
  //   }
  // }, [contextualInformationState.element, scrollRef])

  // Prevent flickering of the component name vignette
  useEffect(() => {
    setIsComponentNameVignetteVisible(false)

    const timeoutId = setTimeout(() => {
      setIsComponentNameVignetteVisible(true)
    }, 16 - 1) // 16ms is the default frame rate, minus 1 to put it in the next frame not the second (not sure if that works :)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [contextualInformationState.element, componentDelta])

  // Reset drag and drop on escape key
  useEffect(() => {
    window.addEventListener('keydown', handleWindowKeyDown)

    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown)
    }
  }, [handleWindowKeyDown])

  if (!componentAddress) return null

  return (
    <>
      {renderContextMenu()}
      {renderComponentVignette()}
      {renderDropVignette()}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <H3>Cannot delete component</H3>
        <P mt={2}>
          You are currently editing
          {' '}
          {hierarchy[0]?.componentName}
        </P>
        <P mt={1}>
          To delete
          {' '}
          {hierarchy[hierarchy.length - 1]?.componentName}
          {' '}
          you must edit
          {' '}
          {lastEditedHierarchyItem?.componentName}
          .
        </P>
        <Div
          xflex="x6"
          mt={2}
          gap={0.5}
        >
          <Button
            secondary
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Close
          </Button>
          <Button onClick={navigateToLastEditedComponent}>
            Go to
            {' '}
            {lastEditedHierarchyItem?.componentName}
          </Button>
        </Div>
      </Modal>
    </>
  )
}

export default ContextualInformation
