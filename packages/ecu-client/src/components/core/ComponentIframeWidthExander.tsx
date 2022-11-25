import { ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { Div } from 'honorable'

import BreakpointContext from '../../contexts/BreakpointContext'

type ComponentIframeWidthExanderPropsType = {
  children: ReactNode
}

function ComponentIframeWidthExpander({ children }: ComponentIframeWidthExanderPropsType) {
  const { width } = useContext(BreakpointContext)

  return (
    <Div
      xflex="x4s"
      flexGrow
      flexShrink={1}
    >
      <Div flexGrow />
      <ComponentIframeWidthExanderHandle />
      <Div
        xflex="y2s"
        width={width}
        overflowY="auto"
      >
        {children}
      </Div>
      <ComponentIframeWidthExanderHandle />
      <Div flexGrow />
    </Div>
  )
}

function ComponentIframeWidthExanderHandle() {
  const { breakpoint, setWidth, isDragging, setIsDragging } = useContext(BreakpointContext)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [setIsDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [setIsDragging])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!(isDragging && breakpoint)) return

    setWidth(width => Math.max(breakpoint.min, Math.min(breakpoint.max, width - event.movementX)))
  }, [isDragging, breakpoint, setWidth])

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
      _hover={{ backgroundColor: 'primary' }}
      onMouseDown={handleMouseDown}
    />
  )
}

export default ComponentIframeWidthExpander
