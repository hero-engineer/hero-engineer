import { ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { Div } from 'honorable'

import BreakpointContext from '../../contexts/BreakpointContext'

type ComponentIframeWidthExanderPropsType = {
  children: ReactNode
}

function ComponentIframeWidthExpander({ children }: ComponentIframeWidthExanderPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const maxWidth = useMemo(() => rootRef.current?.getBoundingClientRect().width ?? Infinity, [rootRef.current])

  const { width } = useContext(BreakpointContext)

  return (
    <Div
      ref={rootRef}
      xflex="x4s"
      flexGrow
      flexShrink={1}
    >
      <Div flexGrow />
      <ComponentIframeWidthExanderHandle maxWidth={maxWidth} />
      <Div
        xflex="y2s"
        width={width}
        overflowY="auto"
      >
        {children}
      </Div>
      <ComponentIframeWidthExanderHandle maxWidth={maxWidth} />
      <Div flexGrow />
    </Div>
  )
}

type ComponentIframeWidthExanderHandlePropsType = {
  maxWidth: number
}

function ComponentIframeWidthExanderHandle({ maxWidth }: ComponentIframeWidthExanderHandlePropsType) {
  const { breakpoint, setWidth, isDragging, setIsDragging } = useContext(BreakpointContext)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [setIsDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [setIsDragging])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!(isDragging && breakpoint)) return

    setWidth(width => Math.max(breakpoint.min, Math.min(maxWidth, breakpoint.max, width - event.movementX)))
  }, [isDragging, breakpoint, setWidth, maxWidth])

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

export default ComponentIframeWidthExpander
