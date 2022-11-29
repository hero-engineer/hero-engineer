import { useCallback, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Div, Tooltip } from 'honorable'
import { AiOutlineDesktop, AiOutlineMobile, AiOutlineTablet } from 'react-icons/ai'

import { BreakpointType } from '../../types'

import BreakpointContext from '../../contexts/BreakpointContext'
import useQuery from '../../hooks/useQuery'
import { BreakpointsQuery, BreakpointsQueryDataType } from '../../queries'
import useRefetch from '../../hooks/useRefetch'
import { refetchKeys } from '../../constants'

const infinityValue = 999999999

const icons = [
  <AiOutlineDesktop style={{ transform: 'scale(1.25, 1)' }} />,
  <AiOutlineDesktop />,
  <AiOutlineTablet />,
  <AiOutlineMobile style={{ transform: 'rotate(90deg)' }} />,
  <AiOutlineMobile />,
]

function BreakpointsButtons() {
  const { componentAddress = '' } = useParams()
  const { breakpoint, setBreakpoint, width, setWidth } = useContext(BreakpointContext)

  const [breakpointsQueryResult, refetchBreakpointsQuery] = useQuery<BreakpointsQueryDataType>({
    query: BreakpointsQuery,
  })

  useRefetch({
    key: refetchKeys.breakpoints,
    refetch: refetchBreakpointsQuery,
  })

  const updateBreakpoint = useCallback((breakpoint: BreakpointType) => {
    setBreakpoint(breakpoint)
    setWidth(breakpoint.base)
  }, [setBreakpoint, setWidth])

  useEffect(() => {
    if (!breakpointsQueryResult.data?.breakpoints) return

    const { breakpoints } = breakpointsQueryResult.data

    const existingBreakpoint = breakpoints.find(b => b.id === breakpoint.id)

    if (existingBreakpoint) {
      setWidth(existingBreakpoint.base)

      return
    }

    const nextBreakpoint = breakpoints.find(b => !b.media) ?? breakpoints[0]

    setWidth(nextBreakpoint.base)
    setBreakpoint(nextBreakpoint)
  }, [breakpointsQueryResult.data, breakpoint, setBreakpoint, setWidth])

  if (!componentAddress) return null

  const breakpoints = breakpointsQueryResult.data?.breakpoints ?? []

  if (!breakpoints.length) return null

  return (
    <Div
      xflex="x4"
      borderLeft="1px solid border"
      userSelect="none"
    >
      {breakpoints.map((bp, i) => (
        <Tooltip
          key={bp.id}
          label={(
            <Div xflex="y2">
              <Div>{bp.name}</Div>
              <Div>
                {bp.max >= infinityValue ? '∞' : bp.max}
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
            toggled={bp.id === breakpoint?.id}
            color={bp.media && bp.id === breakpoint?.id ? 'breakpoint' : 'inherit'}
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
