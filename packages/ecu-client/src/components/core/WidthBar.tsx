import { Div } from 'honorable'
import { ReactNode, useCallback, useContext, useRef } from 'react'

import BreakpointContext from '../../contexts/BreakpointContext'

const largeIncrement = 50
const smallIncrement = 5

function WidthBar() {
  const rootRef = useRef<HTMLDivElement>(null)

  const { isDragging, width } = useContext(BreakpointContext)

  const renderTicks = useCallback(() => {
    if (!rootRef.current) return null

    const rootWidth = rootRef.current.getBoundingClientRect().width
    const spanWidth = rootWidth - (rootWidth - width) / 2
    const ticks: ReactNode[] = []

    for (let i = 0; i < spanWidth; i += smallIncrement) {
      ticks.push(
        <Div
          key={i}
          width={1}
          height={i % largeIncrement === 0 ? '100%' : i % (2 * smallIncrement) === 0 ? '33.333%' : '16.666%'}
          backgroundColor="grey.500"
          marginRight={smallIncrement}
        />
      )
    }

    return ticks
  }, [width])

  if (!isDragging) return null

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
        xflex="x7"
        flexGrow
        ml={`calc(100% - ${width}px - (100% - ${width}px) / 2)`}
      >
        {renderTicks()}
      </Div>
    </Div>
  )
}

export default WidthBar
