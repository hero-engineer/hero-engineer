import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Div, Path, Svg, WithOutsideClick } from 'honorable'

import { cssAttributesMap, spacingSemanticValues } from '../../constants'
import { CssValueType, SpacingType, SpacingsType } from '../../types'

import useRefresh from '../../hooks/useRefresh'

import SpacingEditorInput from './SpacingEditorInput'

type SpacingEditorPropsType = {
  title: string
  semanticName: string
  allowNegativeValues?: boolean
  value: SpacingsType
  onChange: (attributeName: string, value: SpacingType) => void
  height?: number | string
  borderSize?: number
  offetHorizontal?: number
  inputMountNode: Element | null
  workingCssValues: Record<string, CssValueType>
  children?: ReactNode
}

function SpacingEditor({
  title,
  semanticName,
  allowNegativeValues,
  value,
  onChange,
  height = '100%',
  borderSize = 25,
  offetHorizontal = 0,
  inputMountNode,
  workingCssValues,
  children,
}: SpacingEditorPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)
  const unitMenuRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [editedIndex, setEditedIndex] = useState(-1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { width: svgWidth, height: svgHeight } = useMemo(() => rootRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 }, [rootRef.current])
  const workingCssValuesKeys = useMemo(() => Object.keys(workingCssValues), [workingCssValues])

  const handleHover = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  const handleInputOutsideClick = useCallback((event: MouseEvent | TouchEvent) => {
    const editedValue = value[editedIndex]
    const cssAttributeName = `${semanticName}-${spacingSemanticValues[editedIndex]}`

    if (!cssAttributesMap[cssAttributeName].isValueValid(editedValue)) {
      onChange(`${semanticName}-${spacingSemanticValues[editedIndex]}`, cssAttributesMap[`${semanticName}-${spacingSemanticValues[editedIndex]}`].defaultValue)
    }
    if (!rootRef.current?.contains(event.target as Node) || childrenRef.current?.contains(event.target as Node) || unitMenuRef.current?.contains(event.target as Node)) {
      setEditedIndex(-1)
    }
  }, [value, editedIndex, onChange, semanticName])

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
          // Top
          d={`M 0 0 L ${borderSize} ${borderSize} L ${svgWidth - borderSize} ${borderSize} L ${svgWidth} 0 Z`}
          fill={`darken(background-light, ${hoveredIndex === 0 ? 10 : 6}%)`}
        />
        <Path
          // Right
          d={`M ${svgWidth} 0 L ${svgWidth - borderSize} ${borderSize} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${svgWidth} ${svgHeight} Z`}
          fill={`darken(background-light, ${hoveredIndex === 1 ? 12 : 8}%)`}
        />
        <Path
          // Bottom
          d={`M ${svgWidth} ${svgHeight} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill={`darken(background-light, ${hoveredIndex === 2 ? 10 : 6}%)`}
        />
        <Path
          // Left
          d={`M 0 0 L ${borderSize} ${borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill={`darken(background-light, ${hoveredIndex === 3 ? 12 : 8}%)`}
        />
      </Svg>
      {!!svgWidth && (
        <Div
          // Top
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
            color={workingCssValuesKeys.includes(`${semanticName}-top`) && value[0].toString() !== cssAttributesMap[`${semanticName}-top`].defaultValue.toString() ? 'primary' : 'inherit'}
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
          // Right
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
            color={workingCssValuesKeys.includes(`${semanticName}-right`) && value[1].toString() !== cssAttributesMap[`${semanticName}-right`].defaultValue.toString() ? 'primary' : 'inherit'}
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
          // Bottom
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
            color={workingCssValuesKeys.includes(`${semanticName}-bottom`) && value[2].toString() !== cssAttributesMap[`${semanticName}-bottom`].defaultValue.toString() ? 'primary' : 'inherit'}
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
          // Left
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
            color={workingCssValuesKeys.includes(`${semanticName}-left`) && value[3].toString() !== cssAttributesMap[`${semanticName}-left`].defaultValue.toString() ? 'primary' : 'inherit'}
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
          // Top
          d={`M 0 0 L ${borderSize} ${borderSize} L ${svgWidth - borderSize} ${borderSize} L ${svgWidth} 0 Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(0)}
          onMouseLeave={() => handleHover(-1)}
          onClick={() => setEditedIndex(0)}
          cursor="pointer"
        />
        <Path
          // Right
          d={`M ${svgWidth} 0 L ${svgWidth - borderSize} ${borderSize} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${svgWidth} ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(1)}
          onMouseLeave={() => handleHover(-1)}
          onClick={() => setEditedIndex(1)}
          cursor="pointer"
        />
        <Path
          // Bottom
          d={`M ${svgWidth} ${svgHeight} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(2)}
          onMouseLeave={() => handleHover(-1)}
          onClick={() => setEditedIndex(2)}
          cursor="pointer"
        />
        <Path
          // Left
          d={`M 0 0 L ${borderSize} ${borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(3)}
          onMouseLeave={() => handleHover(-1)}
          onClick={() => setEditedIndex(3)}
          cursor="pointer"
        />
      </Svg>
      <Div
        ref={childrenRef}
        position="absolute"
        top={borderSize}
        bottom={borderSize}
        left={borderSize}
        right={borderSize}
        p={0.25}
      >
        {children}
      </Div>
      {editedIndex !== -1 && !!inputMountNode && createPortal(
        <WithOutsideClick
          preventFirstFire
          onOutsideClick={handleInputOutsideClick}
        >
          <SpacingEditorInput
            value={value[editedIndex]}
            onChange={x => onChange(`${semanticName}-${spacingSemanticValues[editedIndex]}`, x)}
            title={`${semanticName}-${spacingSemanticValues[editedIndex]}`}
            allowNegativeValues={allowNegativeValues}
            unitMenuRef={unitMenuRef}
          />
        </WithOutsideClick>,
        inputMountNode
      )}
    </Div>
  )
}

export default SpacingEditor
