import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Div, Tooltip } from 'honorable'
import { AiOutlineDesktop, AiOutlineMobile, AiOutlineTablet } from 'react-icons/ai'

import { BreakpointType } from '../../types'

import BreakpointContext from '../../contexts/BreakpointContext'

const icons = [
  <AiOutlineDesktop />,
  <AiOutlineTablet />,
  <AiOutlineMobile style={{ transform: 'rotate(90deg)' }} />,
  <AiOutlineMobile />,
]

const breakpoints: BreakpointType[] = [
  {
    name: 'Desktop',
    value: 1232,
    scale: 1,
  },
  {
    name: 'Tablet',
    value: 768,
    scale: 1,
  },
  {
    name: 'Mobile Landscape',
    value: 568,
    scale: 1,
  },
  {
    name: 'Mobile Portrait',
    value: 320,
    scale: 1,
  },
]

function BreakpointsButtons() {
  const { componentAddress = '' } = useParams()
  const { breakpoint, setBreakpoint } = useContext(BreakpointContext)

  useEffect(() => {
    if (breakpoint && breakpoints.find(bp => bp.name === breakpoint.name)) return

    setBreakpoint(breakpoints[0])
  }, [breakpoint, setBreakpoint])

  if (!componentAddress) return null

  return (
    <Div
      xflex="x4"
      borderLeft="1px solid border"
    >
      {breakpoints.map((bp, i) => (
        <Tooltip
          key={bp.name}
          label={bp.name}
          placement="bottom"
        >
          <Button
            ghost
            toggled={bp.name === breakpoint?.name}
            borderRight="1px solid border"
            onClick={() => setBreakpoint(bp)}
          >
            {icons[i]}
          </Button>
        </Tooltip>
      ))}
      {!!breakpoint && (
        <Div
          ml={0.5}
          fontSize="0.75rem"
        >
          {breakpoint?.value}
          px
        </Div>
      )}
    </Div>
  )
}

export default BreakpointsButtons
