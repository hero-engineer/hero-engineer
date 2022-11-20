import { RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Div, H3, Menu, MenuItem, Modal, P, WithOutsideClick } from 'honorable'

import { useMutation } from 'urql'
import { TbTrash } from 'react-icons/tb'

import HierarchyContext from '../../contexts/HierarchyContext'
import ContextualInformationContext from '../../contexts/ContextualInformationContext'
import { XYType } from '../../types'

import { refetchKeys } from '../../constants'

import { DeleteComponentMutation, DeleteComponentMutationDataType } from '../../queries'

import useEditionSearchParams from '../../hooks/useEditionSearchParams'
import useRefetch from '../../hooks/useRefetch'

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
  const { contextualInformationElement, contextualInformationState, setContextualInformationState } = useContext(ContextualInformationContext)
  const { hierarchyIds, componentDelta, setEditionSearchParams } = useEditionSearchParams()
  const [position, setPosition] = useState<XYType>({ x: 0, y: 0 })
  const [isComponentNameVignetteVisible, setIsComponentNameVignetteVisible] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const navigate = useNavigate()

  const lastHierarchyItem = useMemo(() => hierarchy[hierarchy.length - 1], [hierarchy])
  const lastEditedHierarchyItem = useMemo(() => getLastEditedHierarchyItem(hierarchy), [hierarchy])

  const [, deleteComponent] = useMutation<DeleteComponentMutationDataType>(DeleteComponentMutation)

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

  const readPosition = useCallback(() => {
    if (!contextualInformationElement) return

    const rect = contextualInformationElement.getBoundingClientRect()

    setPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    })
  }, [contextualInformationElement])

  const renderComponentNameVignette = useCallback(() => {
    if (!(lastHierarchyItem && isComponentNameVignetteVisible)) return null

    return (
      <Div
        xflex="x4"
        position="fixed"
        top={`calc(${position.y}px - 16px)`}
        left={`calc(${position.x}px - 1px)`}
        height={16}
        px={0.25}
        className={`ecu-contextual-information ${contextualInformationState.isEdited ? 'ecu-contextual-information-is-edited' : ''} ${contextualInformationState.isComponentRoot ? 'ecu-contextual-information-is-component-root' : ''}`}
      >
        {lastHierarchyItem.componentName}
      </Div>
    )
  }, [
    lastHierarchyItem,
    isComponentNameVignetteVisible,
    position.x,
    position.y,
    contextualInformationState.isEdited,
    contextualInformationState.isComponentRoot,
  ])

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
            <TbTrash />
            {' '}
            Delete component
          </MenuItem>
        </Menu>
      </WithOutsideClick>
    )
  }, [
    contextualInformationState.rightClickEvent,
    closeContextMenu,
    handleDeleteComponentClick,
  ])

  useEffect(() => {
    if (!scrollRef.current) return

    const scrollElement = scrollRef.current

    readPosition()

    window.addEventListener('resize', readPosition)
    window.addEventListener('scroll', readPosition)
    scrollElement.addEventListener('scroll', readPosition)

    const resizeObserver = new ResizeObserver(readPosition)

    resizeObserver.observe(scrollElement)

    return () => {
      window.removeEventListener('resize', readPosition)
      window.removeEventListener('scroll', readPosition)

      scrollElement.removeEventListener('scroll', readPosition)

      resizeObserver.disconnect()
    }
  }, [readPosition, scrollRef])

  useEffect(() => {
    if (!scrollRef.current) return
    if (!contextualInformationElement) return

    const observer = new window.IntersectionObserver(([entry]) => {
      setIsComponentNameVignetteVisible(entry.isIntersecting)
    }, {
      root: scrollRef.current,
      threshold: 0,
      rootMargin: '-16px 0px 0px 0px',
    })

    observer.observe(contextualInformationElement)

    return () => {
      observer.disconnect()
    }
  }, [contextualInformationElement, scrollRef])

  if (!componentAddress) return null

  return (
    <>
      {renderContextMenu()}
      {renderComponentNameVignette()}
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
          <Button onClick={() => setIsDeleteModalOpen(false)}>
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
