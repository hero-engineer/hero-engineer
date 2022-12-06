import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Div, Tooltip } from 'honorable'
import { AiOutlineDesktop, AiOutlineMobile, AiOutlineTablet } from 'react-icons/ai'

import { BreakpointType } from '@types'

import { refetchKeys } from '@constants'

import { BreakpointsQuery, BreakpointsQueryDataType } from '@queries'

import BreakpointContext from '@contexts/BreakpointContext'

import useQuery from '@hooks/useQuery'
import useRefetch from '@hooks/useRefetch'

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
  const { breakpoint, setBreakpoint, breakpoints, setBreakpoints, width, setWidth } = useContext(BreakpointContext)

  const [breakpointsQueryResult, refetchBreakpointsQuery] = useQuery<BreakpointsQueryDataType>({
    query: BreakpointsQuery,
  })

  const workingBreakpoints = useMemo(() => breakpointsQueryResult.data?.breakpoints ?? breakpoints, [breakpointsQueryResult.data, breakpoints])

  useRefetch({
    key: refetchKeys.breakpoints,
    refetch: refetchBreakpointsQuery,
  })

  const handleBreakpointClick = useCallback((breakpoint: BreakpointType) => {
    setBreakpoint(breakpoint)
    setWidth(breakpoint.base)
  }, [setBreakpoint, setWidth])

  useEffect(() => {
    if (!workingBreakpoints.length) return

    const existingBreakpoint = workingBreakpoints.find(b => b.id === breakpoint.id)

    if (existingBreakpoint) {
      setWidth(existingBreakpoint.base)

      return
    }

    const nextBreakpoint = workingBreakpoints.find(b => !b.media) ?? workingBreakpoints[0]

    setWidth(nextBreakpoint.base)
    setBreakpoint(nextBreakpoint)
  }, [workingBreakpoints, breakpoint, setBreakpoint, setWidth])

  useEffect(() => {
    setBreakpoints(workingBreakpoints)
  }, [workingBreakpoints, setBreakpoints])

  if (!componentAddress) return null
  if (!workingBreakpoints.length) return null

  return (
    <Div
      xflex="x4"
      userSelect="none"
    >
      {!!breakpoint && (
        <Div
          minWidth={42}
          mr={0.5}
        />
      )}
      {workingBreakpoints.map((bp, i) => (
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
            _first={{
              borderLeft: '1px solid border',
            }}
            onClick={() => handleBreakpointClick(bp)}
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
