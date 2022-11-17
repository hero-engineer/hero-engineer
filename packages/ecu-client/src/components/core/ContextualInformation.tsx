import { RefObject, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'

import { XYType } from '../../types'

import ContextualInformationContext from '../../contexts/ContextualInformationContext'
import HierarchyContext from '../../contexts/HierarchyContext'

type ContextualInformationPropsType = {
  scrollRef: RefObject<HTMLElement>
}

function ContextualInformation({ scrollRef }: ContextualInformationPropsType) {
  const { componentAddress = '' } = useParams()
  const { hierarchy } = useContext(HierarchyContext)
  const { contextualInformationElement, contextualInformationState } = useContext(ContextualInformationContext)
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

  useEffect(() => {
    if (!scrollRef.current) return

    const scrollElement = scrollRef.current

    readPosition()

    window.addEventListener('resize', readPosition)
    window.addEventListener('scroll', readPosition)
    scrollElement.addEventListener('scroll', readPosition)

    return () => {
      window.removeEventListener('resize', readPosition)
      window.removeEventListener('scroll', readPosition)

      scrollElement.removeEventListener('scroll', readPosition)
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
  if (!lastHierarchyItem) return null

  return (
    <Div
      xflex="x4"
      position="fixed"
      top={`calc(${position.y}px - 16px)`}
      left={`calc(${position.x}px - 1px)`}
      height={16}
      fontSize={12}
      display={isComponentNameVignetteVisible ? 'flex' : 'none'}
      px={0.25}
      className={`ecu-contextual-information ${contextualInformationState.isEdited ? 'ecu-contextual-information-is-edited' : ''} ${contextualInformationState.isComponentRoot ? 'ecu-contextual-information-is-component-root' : ''}`}
    >
      {lastHierarchyItem.componentName}
    </Div>
  )
}

export default ContextualInformation
