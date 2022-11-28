import { ReactNode, memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { Div } from 'honorable'

import BreakpointContext from '../../contexts/BreakpointContext'

import useClearHierarchyIdsAndComponentDeltaOnClick from '../../hooks/useClearHierarchyIdsAndComponentDeltaOnClick'

type ComponentIframeWidthExanderPropsType = {
  children: ReactNode
}

function ComponentIframeWidthExpander({ children }: ComponentIframeWidthExanderPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useClearHierarchyIdsAndComponentDeltaOnClick(leftRef)
  useClearHierarchyIdsAndComponentDeltaOnClick(rightRef)
  useClearHierarchyIdsAndComponentDeltaOnClick(contentRef)

  const { width } = useContext(BreakpointContext)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const maxWidth = useMemo(() => rootRef.current?.getBoundingClientRect().width ?? Infinity, [rootRef.current])

  return (
    <Div
      ref={rootRef}
      xflex="x4s"
      flexGrow
      flexShrink={1}
    >
      <Div
        ref={leftRef}
        flexGrow
      />
      <ComponentIframeWidthExanderHandle
        isLeft
        maxWidth={maxWidth}
      />
      <Div
        ref={contentRef}
        xflex="y2s"
        width={width}
        overflowY="auto"
      >
        {children}
      </Div>
      <ComponentIframeWidthExanderHandle
        maxWidth={maxWidth}
      />
      <Div
        ref={rightRef}
        flexGrow
      />
    </Div>
  )
}

type ComponentIframeWidthExanderHandlePropsType = {
  isLeft?: boolean
  maxWidth: number
}

function ComponentIframeWidthExanderHandle({ isLeft, maxWidth }: ComponentIframeWidthExanderHandlePropsType) {
  const { breakpoint, setWidth, isDragging, setIsDragging } = useContext(BreakpointContext)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [setIsDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [setIsDragging])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!(isDragging && breakpoint)) return

    setWidth(width => Math.max(breakpoint.min, Math.min(maxWidth, breakpoint.max, width + (isLeft ? -1 : 1) * event.movementX)))
  }, [isDragging, breakpoint, setWidth, maxWidth, isLeft])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseUp])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <Div
      width={5}
      cursor="col-resize"
      backgroundColor={isDragging ? 'primary' : undefined}
      userSelect="none"
      _hover={{ backgroundColor: 'primary' }}
      onMouseDown={handleMouseDown}
    />
  )
}

export default memo(ComponentIframeWidthExpander)
