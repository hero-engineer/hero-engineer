import { useCallback, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Div, Tooltip } from 'honorable'
import { AiOutlineDesktop, AiOutlineMobile, AiOutlineTablet } from 'react-icons/ai'

import { BreakpointType } from '../../types'

import BreakpointContext from '../../contexts/BreakpointContext'

const icons = [
  <AiOutlineDesktop style={{ transform: 'scale(1.25, 1)' }} />,
  <AiOutlineDesktop />,
  <AiOutlineTablet />,
  <AiOutlineMobile style={{ transform: 'rotate(90deg)' }} />,
  <AiOutlineMobile />,
]

const breakpoints: BreakpointType[] = [
  {
    name: 'Desktop Large',
    max: Infinity,
    min: 1280,
    base: 1280,
    scale: 1,
  },
  {
    name: 'Desktop',
    max: 1279,
    min: 992,
    base: 1232,
    scale: 1,
  },
  {
    name: 'Tablet',
    max: 991,
    min: 768,
    base: 768,
    scale: 1,
  },
  {
    name: 'Mobile Landscape',
    max: 767,
    min: 479,
    base: 568,
    scale: 1,
  },
  {
    name: 'Mobile Portrait',
    max: 478,
    min: 0,
    base: 320,
    scale: 1,
  },
]

function BreakpointsButtons() {
  const { componentAddress = '' } = useParams()
  const { breakpoint, setBreakpoint, setBreakpoints, width, setWidth } = useContext(BreakpointContext)

  const updateBreakpoint = useCallback((breakpoint: BreakpointType) => {
    setBreakpoint(breakpoint)
    setWidth(breakpoint.base)
  }, [setBreakpoint, setWidth])

  useEffect(() => {
    setBreakpoints(breakpoints)
  }, [setBreakpoints])

  useEffect(() => {
    if (breakpoint && breakpoints.find(bp => bp.name === breakpoint.name)) return

    setBreakpoint(breakpoints[1])
    setWidth(breakpoints[1].max)
  }, [breakpoint, setBreakpoint, setWidth])

  if (!componentAddress) return null

  return (
    <Div
      xflex="x4"
      borderLeft="1px solid border"
      userSelect="none"
    >
      {breakpoints.map((bp, i) => (
        <Tooltip
          key={bp.name}
          label={(
            <Div xflex="y2">
              <Div>{bp.name}</Div>
              <Div>
                {bp.max === Infinity ? '∞' : bp.max}
                px -
                {' '}
                {bp.min}
                px
              </Div>
            </Div>
          )}
          placement="bottom"
        >
          <Button
            ghost
            toggled={bp.name === breakpoint?.name}
            borderRight="1px solid border"
            onClick={() => updateBreakpoint(bp)}
          >
            {icons[i]}
          </Button>
        </Tooltip>
      ))}
      {!!breakpoint && (
        <Div
          minWidth={42}
          fontSize="0.75rem"
          ml={0.5}
        >
          {width}
          px
        </Div>
      )}
    </Div>
  )
}

export default BreakpointsButtons
