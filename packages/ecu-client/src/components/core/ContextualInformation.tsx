import { RefObject, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { A, Button, Div, H3, Menu, MenuItem, Modal, P, WithOutsideClick } from 'honorable'

import { useMutation } from 'urql'
import { SlTrash } from 'react-icons/sl'

import HierarchyContext from '../../contexts/HierarchyContext'
import ContextualInformationContext from '../../contexts/ContextualInformationContext'
import DragAndDropContext from '../../contexts/DragAndDropContext'
import { RectType } from '../../types'

import { refetchKeys } from '../../constants'

import { DeleteComponentMutation, DeleteComponentMutationDataType } from '../../queries'

import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useRefetch from '../../hooks/useRefetch'
import useIsComponentRefreshingMutation from '../../hooks/useIsComponentRefreshingMutation'

import isHierarchyOnComponent from '../../helpers/isHierarchyOnComponent'
import getLastEditedHierarchyItem from '../../helpers/getLastEditedHierarchyItem'

type ContextualInformationPropsType = {
  scrollRef: RefObject<HTMLElement>
}

// Displays:
// - the context menu on component
// - the component name vignette
function ContextualInformation({ scrollRef }: ContextualInformationPropsType) {
  const { componentAddress = '' } = useParams()
  const contextualMenuRef = useRef<HTMLDivElement>(null)
  const { hierarchy } = useContext(HierarchyContext)
  const { contextualInformationState, setContextualInformationState } = useContext(ContextualInformationContext)
  const { dragAndDrop, setDragAndDrop } = useContext(DragAndDropContext)
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()

  const [elementRect, setElementRect] = useState<RectType>({ x: 0, y: 0, width: 0, height: 0 })
  const [dropElementRect, setDropElementRect] = useState<RectType>({ x: 0, y: 0, width: 0, height: 0 })
  const [isComponentNameVignetteVisible, setIsComponentNameVignetteVisible] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const navigate = useNavigate()

  const lastHierarchyItem = useMemo(() => hierarchy[hierarchy.length - 1], [hierarchy])
  const lastEditedHierarchyItem = useMemo(() => getLastEditedHierarchyItem(hierarchy), [hierarchy])

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

    refetch(refetchKeys.hierarchy)
  }, [
    closeContextMenu,
    hierarchy,
    componentDelta,
    componentAddress,
    deleteComponent,
    hierarchyIds,
    setEditionSearchParams,
    refetch,
  ])

  const navigateToLastEditedComponent = useCallback(() => {
    setIsDeleteModalOpen(false)

    navigate(`/_ecu_/component/${lastEditedHierarchyItem?.componentAddress}`)
  }, [navigate, lastEditedHierarchyItem])

  const readElementPosition = useCallback(() => {
    if (!contextualInformationState.element) return

    const rect = contextualInformationState.element.getBoundingClientRect()

    setElementRect({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    })
  }, [contextualInformationState.element])

  const readDropElementPosition = useCallback(() => {
    if (!contextualInformationState.dropElement) return

    const rect = contextualInformationState.dropElement.getBoundingClientRect()

    setDropElementRect({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    })
  }, [contextualInformationState.dropElement])

  // Reset drag and drop on Escape key
  const handleWindowKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDragAndDrop({
        sourceHierarchyId: '',
        targetHierarchyId: '',
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
    elementRect.x,
    elementRect.y,
    contextualInformationState.element,
    contextualInformationState.isEdited,
    contextualInformationState.isComponentRoot,
  ])

  const renderDropVignette = useCallback(() => {
    if (!contextualInformationState.dropElement) return null
    if (!(dragAndDrop.sourceHierarchyId && dragAndDrop.targetHierarchyId)) return null

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
        gap={0.25}
        px={0.25}
      >
        <A color="inherit">
          Before
        </A>
        <A color="inherit">
          After
        </A>
        <A color="inherit">
          Children
        </A>
      </Div>
    )
  }, [
    dragAndDrop.sourceHierarchyId,
    dragAndDrop.targetHierarchyId,
    contextualInformationState.dropElement,
    dropElementRect.x,
    dropElementRect.y,
    dropElementRect.height,
  ])

  useEffect(() => {
    if (!scrollRef.current) return

    const scrollElement = scrollRef.current

    readElementPosition()

    window.addEventListener('resize', readElementPosition)
    window.addEventListener('scroll', readElementPosition)
    scrollElement.addEventListener('scroll', readElementPosition)

    const resizeObserver = new ResizeObserver(readElementPosition)

    resizeObserver.observe(scrollElement)

    return () => {
      window.removeEventListener('resize', readElementPosition)
      window.removeEventListener('scroll', readElementPosition)

      scrollElement.removeEventListener('scroll', readElementPosition)

      resizeObserver.disconnect()
    }
  }, [readElementPosition, scrollRef])

  useEffect(() => {
    if (!scrollRef.current) return

    const scrollElement = scrollRef.current

    readDropElementPosition()

    window.addEventListener('resize', readDropElementPosition)
    window.addEventListener('scroll', readDropElementPosition)
    scrollElement.addEventListener('scroll', readDropElementPosition)

    const resizeObserver = new ResizeObserver(readDropElementPosition)

    resizeObserver.observe(scrollElement)

    return () => {
      window.removeEventListener('resize', readDropElementPosition)
      window.removeEventListener('scroll', readDropElementPosition)

      scrollElement.removeEventListener('scroll', readDropElementPosition)

      resizeObserver.disconnect()
    }
  }, [readDropElementPosition, scrollRef])

  useEffect(() => {
    if (!scrollRef.current) return
    if (!contextualInformationState.element) return

    const observer = new window.IntersectionObserver(([entry]) => {
      setIsComponentNameVignetteVisible(entry.isIntersecting)
    }, {
      root: scrollRef.current,
      threshold: 0,
      rootMargin: '-16px 0px 0px 0px',
    })

    observer.observe(contextualInformationState.element)

    return () => {
      observer.disconnect()
    }
  }, [contextualInformationState.element, scrollRef])

  // Prevent flickering of the component name vignette
  useEffect(() => {
    setIsComponentNameVignetteVisible(false)

    const timeoutId = setTimeout(() => {
      setIsComponentNameVignetteVisible(true)
    }, 16)

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
