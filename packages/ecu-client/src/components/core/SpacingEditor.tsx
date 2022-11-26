import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Div, Path, Svg } from 'honorable'

export type SpacingEditorValueType = string | number

type SpacingEditorPropsType = {
  title: string;
  children?: ReactNode
  value: [SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType]
  onChange: (value: [SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType]) => void
  height?: number | string
  borderSize?: number
  offetHorizontal?: number
}

function SpacingEditor({ title, children, value, onChange, height = '100%', borderSize = 25, offetHorizontal = 0 }: SpacingEditorPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [, setRefresh] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { width: svgWidth, height: svgHeight } = useMemo(() => rootRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 }, [rootRef.current])

  const handleHover = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  useEffect(() => {
    setRefresh(x => !x)
  }, [])

  return (
    <Div
      ref={rootRef}
      xflex="x4"
      position="relative"
    >
      <Svg
        width={svgWidth}
        height={height}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
      >
        <Path
          d={`M 0 0 L ${borderSize} ${borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill={`darken(background-light, ${hoveredIndex === 1 ? 12 : 8}%)`}
        />
        <Path
          d={`M 0 0 L ${borderSize} ${borderSize} L ${svgWidth - borderSize} ${borderSize} L ${svgWidth} 0 Z`}
          fill={`darken(background-light, ${hoveredIndex === 0 ? 10 : 6}%)`}
        />
        <Path
          d={`M ${svgWidth} 0 L ${svgWidth - borderSize} ${borderSize} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${svgWidth} ${svgHeight} Z`}
          fill={`darken(background-light, ${hoveredIndex === 2 ? 12 : 8}%)`}
        />
        <Path
          d={`M ${svgWidth} ${svgHeight} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill={`darken(background-light, ${hoveredIndex === 3 ? 10 : 6}%)`}
        />
      </Svg>
      {!!svgWidth && (
        <Div
          xflex="x5"
          position="absolute"
          top={borderSize / 2}
          left={svgWidth / 2}
          fontSize="0.75rem"
          lineHeight="0.75rem"
        >
          <Div
            xflex="x5"
            position="absolute"
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {value[0]}
          </Div>
        </Div>
      )}
      {!!svgWidth && (
        <Div
          xflex="x5"
          position="absolute"
          top={svgHeight / 2}
          left={borderSize / 2 - offetHorizontal}
          fontSize="0.75rem"
          lineHeight="0.75rem"
        >
          <Div
            xflex="x5"
            position="absolute"
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {value[1]}
          </Div>
        </Div>
      )}
      {!!svgWidth && (
        <Div
          xflex="x5"
          position="absolute"
          top={svgHeight / 2}
          right={borderSize / 2 - offetHorizontal}
          fontSize="0.75rem"
          lineHeight="0.75rem"
        >
          <Div
            xflex="x5"
            position="absolute"
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {value[2]}
          </Div>
        </Div>
      )}
      {!!svgWidth && (
        <Div
          xflex="x5"
          position="absolute"
          bottom={borderSize / 2}
          left={svgWidth / 2}
          fontSize="0.75rem"
          lineHeight="0.75rem"
        >
          <Div
            xflex="x5"
            position="absolute"
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {value[3]}
          </Div>
        </Div>
      )}
      {!!svgWidth && (
        <Div
          position="absolute"
          top={4}
          left={4}
          fontSize="0.75rem"
          lineHeight="0.75rem"
          color="text-light"
        >
          {title}
        </Div>
      )}
      <Svg
        width={svgWidth}
        height={height}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      >
        <Path
          d={`M 0 0 L ${borderSize} ${borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(1)}
          onMouseLeave={() => handleHover(-1)}
          cursor="pointer"
        />
        <Path
          d={`M 0 0 L ${borderSize} ${borderSize} L ${svgWidth - borderSize} ${borderSize} L ${svgWidth} 0 Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(0)}
          onMouseLeave={() => handleHover(-1)}
          cursor="pointer"
        />
        <Path
          d={`M ${svgWidth} 0 L ${svgWidth - borderSize} ${borderSize} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${svgWidth} ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(2)}
          onMouseLeave={() => handleHover(-1)}
          cursor="pointer"
        />
        <Path
          d={`M ${svgWidth} ${svgHeight} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(3)}
          onMouseLeave={() => handleHover(-1)}
          cursor="pointer"
        />
      </Svg>
      <Div
        position="absolute"
        top={borderSize}
        bottom={borderSize}
        left={borderSize}
        right={borderSize}
        p={0.25}
      >
        {children}
      </Div>
    </Div>
  )
}

export default SpacingEditor
