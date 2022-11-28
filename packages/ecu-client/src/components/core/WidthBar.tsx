import { ReactNode, memo, useContext, useMemo, useRef } from 'react'
import { Div } from 'honorable'

import BreakpointContext from '../../contexts/BreakpointContext'
import ThemeModeContext from '../../contexts/ThemeModeContext'

import useRefresh from '../../hooks/useRefresh'

const largeIncrement = 50
const smallIncrement = 5
const tickWidth = 1

function WidthBar() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { width, isDragging } = useContext(BreakpointContext)
  const { themeMode } = useContext(ThemeModeContext)

  useRefresh([isDragging])

  const ticks = useMemo(() => {
    if (!rootRef.current) return null

    const rootWidth = rootRef.current.getBoundingClientRect().width
    const ticks: ReactNode[] = []

    for (let i = 0; i < rootWidth; i += smallIncrement) {
      ticks.push(
        <div
          key={i}
          style={{
            flexShrink: 0,
            width: tickWidth,
            height: i % largeIncrement === 0 ? '100%' : i % (2 * smallIncrement) === 0 ? '33.333%' : '16.666%',
            backgroundColor: themeMode === 'light' ? 'darkslategray' : 'white',
            marginRight: smallIncrement - tickWidth,
          }}
        />
      )

      if (i % largeIncrement === 0) {
        ticks.push(
          <div
            key={`${i}label`}
            style={{
              position: 'absolute',
              top: 2,
              left: i + 4,
              flexShrink: 0,
              fontSize: '0.666rem',
            }}
          >
            {i}
          </div>
        )
      }
    }

    return ticks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef.current])

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
