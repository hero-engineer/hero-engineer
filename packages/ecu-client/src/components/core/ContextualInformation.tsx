import { RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Div, Menu, useOutsideClick } from 'honorable'

import { XYType } from '../../types'

import ContextualInformationContext from '../../contexts/ContextualInformationContext'
import HierarchyContext from '../../contexts/HierarchyContext'

type ContextualInformationPropsType = {
  scrollRef: RefObject<HTMLElement>
}

function ContextualInformation({ scrollRef }: ContextualInformationPropsType) {
  const { componentAddress = '' } = useParams()
  const contextualMenuRef = useRef<HTMLDivElement>(null)
  const { hierarchy } = useContext(HierarchyContext)
  const { contextualInformationElement, contextualInformationState, setContextualInformationState } = useContext(ContextualInformationContext)
  const [position, setPosition] = useState<XYType>({ x: 0, y: 0 })
  const [isComponentNameVignetteVisible, setIsComponentNameVignetteVisible] = useState(false)
  const lastHierarchyItem = useMemo(() => hierarchy[hierarchy.length - 1], [hierarchy])

  const readPosition = useCallback(() => {
    if (!contextualInformationElement) return

    const rect = contextualInformationElement.getBoundingClientRect()

    setPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    })
  }, [contextualInformationElement])

  const closeContextualMenu = useCallback(() => {
    setContextualInformationState(x => ({ ...x, rightClickEvent: null }))
  }, [setContextualInformationState])

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

  const renderContextualMenu = useCallback(() => {
    if (!contextualInformationState.rightClickEvent) return null

    const { pageX, pageY } = contextualInformationState.rightClickEvent

    return (
      <Menu
        ref={contextualMenuRef}
        position="fixed"
        top={pageY}
        left={pageX}
      >
        Foo
      </Menu>
    )
  }, [contextualInformationState.rightClickEvent])

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

  useOutsideClick(contextualMenuRef, closeContextualMenu)

  if (!componentAddress) return null

  return (
    <>
      {renderContextualMenu()}
      {renderComponentNameVignette()}
    </>
  )
}

export default ContextualInformation
