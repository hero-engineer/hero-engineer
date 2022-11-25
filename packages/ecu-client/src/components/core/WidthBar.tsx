import { ReactNode, memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Div } from 'honorable'

import BreakpointContext from '../../contexts/BreakpointContext'

const largeIncrement = 50
const smallIncrement = 5
const tickWidth = 1

function WidthBar() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [, setRefresh] = useState(false) // For rootRef to refresh

  const { width } = useContext(BreakpointContext)

  const ticks = useMemo(() => {
    if (!rootRef.current) return null

    const rootWidth = rootRef.current.getBoundingClientRect().width
    const ticks: ReactNode[] = []

    for (let i = 0; i < rootWidth; i += smallIncrement) {
      ticks.push(
        <Div
          key={i}
          flexShrink={0}
          width={tickWidth}
          height={i % largeIncrement === 0 ? '100%' : i % (2 * smallIncrement) === 0 ? '33.333%' : '16.666%'}
          backgroundColor="grey.500"
          marginRight={smallIncrement - tickWidth}
        />
      )

      if (i % largeIncrement === 0) {
        ticks.push(
          <Div
            key={`${i}label`}
            position="absolute"
            top={2}
            left={i + 4}
            flexShrink={0}
            fontSize="0.666rem"
          >
            {i}
          </Div>
        )
      }
    }

    return ticks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef.current])

  useEffect(() => {
    setRefresh(refresh => !refresh)
  }, [])

  return (
    <Div
      ref={rootRef}
      xflex="x4s"
      flexShrink={0}
      height={30}
      backgroundColor="background-light"
      borderTop="1px solid border"
    >
      <Div
        position="relative"
        xflex="x7"
        flexGrow
        overflow="hidden"
        ml={`calc(100% - ${width}px - (100% - ${width}px) / 2)`}
      >
        {ticks}
      </Div>
    </Div>
  )
}

export default memo(WidthBar)
