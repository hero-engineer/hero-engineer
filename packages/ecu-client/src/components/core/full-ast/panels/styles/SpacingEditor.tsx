import { ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Div, Path, Svg, WithOutsideClick } from 'honorable'

import { cssAttributesMap } from '~constants'

import StylesContext from '~contexts/StylesContext'

import useRefresh from '~hooks/useRefresh'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

import doesParentHaveId from '~utils/doesParentHaveId'

import SpacingEditorInput from '~core/full-ast/panels/styles/SpacingEditorInput'

type SpacingEditorPropsType = {
  title: string
  semanticName: string
  allowNegativeValues?: boolean
  height?: number | string
  borderSize?: number
  offetHorizontal?: number
  inputMountNode: Element | null
  children?: ReactNode
}

function SpacingEditor({
  title,
  semanticName,
  allowNegativeValues,
  height = '100%',
  borderSize = 25,
  offetHorizontal = 0,
  inputMountNode,
  children,
}: SpacingEditorPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const { onChange } = useContext(StylesContext)

  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [editedAttribute, setEditedAttribute] = useState('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { width: svgWidth, height: svgHeight } = useMemo(() => rootRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 }, [rootRef.current])

  const { getValue, getTextColor, updateCssAttribute } = useStylesSubSectionHelpers()

  const handleHover = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  const handleInputOutsideClick = useCallback((event: MouseEvent | TouchEvent) => {
    if (!editedAttribute) return

    const editedValue = getValue(editedAttribute)

    if (!cssAttributesMap[editedAttribute].isValueValid(editedValue)) {
      onChange([updateCssAttribute(editedAttribute, cssAttributesMap[editedAttribute].defaultValue)])
    }

    if ((!rootRef.current?.contains(event.target as Node) || childrenRef.current?.contains(event.target as Node)) && !doesParentHaveId(event.target as Element, 'CssValueInput-unit-menu')) {
      setEditedAttribute('')
    }
  }, [editedAttribute, onChange, getValue, updateCssAttribute])

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
            color={getTextColor([`${semanticName}top`])}
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {getValue(`${semanticName}top`)}
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
            color={getTextColor([`${semanticName}right`])}
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {getValue(`${semanticName}right`)}
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
            color={getTextColor([`${semanticName}bottom`])}
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {getValue(`${semanticName}bottom`)}
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
            color={getTextColor([`${semanticName}left`])}
            top={-borderSize / 2}
            left={-borderSize / 2}
            right={-borderSize / 2}
            bottom={-borderSize / 2}
          >
            {getValue(`${semanticName}left`)}
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
          onClick={() => setEditedAttribute(`${semanticName}top`)}
          cursor="crosshair"
        />
        <Path
          // Right
          d={`M ${svgWidth} 0 L ${svgWidth - borderSize} ${borderSize} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${svgWidth} ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(1)}
          onMouseLeave={() => handleHover(-1)}
          onClick={() => setEditedAttribute(`${semanticName}right`)}
          cursor="crosshair"
        />
        <Path
          // Bottom
          d={`M ${svgWidth} ${svgHeight} L ${svgWidth - borderSize} ${svgHeight - borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(2)}
          onMouseLeave={() => handleHover(-1)}
          onClick={() => setEditedAttribute(`${semanticName}bottom`)}
          cursor="crosshair"
        />
        <Path
          // Left
          d={`M 0 0 L ${borderSize} ${borderSize} L ${borderSize} ${svgHeight - borderSize} L 0 ${svgHeight} Z`}
          fill="transparent"
          onMouseEnter={() => handleHover(3)}
          onMouseLeave={() => handleHover(-1)}
          onClick={() => setEditedAttribute(`${semanticName}left`)}
          cursor="crosshair"
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
      {!!(editedAttribute && inputMountNode) && createPortal(
        <WithOutsideClick
          preventFirstFire
          onOutsideClick={handleInputOutsideClick}
        >
          <SpacingEditorInput
            value={getValue(editedAttribute)}
            onChange={x => onChange([updateCssAttribute(editedAttribute, x)])}
            title={editedAttribute}
            allowNegativeValues={allowNegativeValues}
          />
        </WithOutsideClick>,
        inputMountNode
      )}
    </Div>
  )
}

export default SpacingEditor
