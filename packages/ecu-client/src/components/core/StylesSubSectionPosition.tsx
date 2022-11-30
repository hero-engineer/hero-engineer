import { useCallback, useRef } from 'react'
import { Accordion, Div, MenuItem, Select } from 'honorable'

import { CssAttributeType, CssValuesType } from '../../types'
import { cssAttributesMap } from '../../constants'

import useRefresh from '../../hooks/useRefresh'
import usePersistedState from '../../hooks/usePersistedState'

import capitalize from '../../utils/capitalize'

import SpacingEditor from './SpacingEditor'
import StylesSubSectionTitle from './StylesSubSectionTitle'
import StylesSubSectionDisabledOverlay from './StylesSubSectionDisabledOverlay'

type StylesSubSectionPositionPropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  onChange: (attributes: CssAttributeType[]) => void
  disabled: boolean
}

const attributeNames = [
  'position',
  'top',
  'right',
  'bottom',
  'left',
]

const positions = [
  'static',
  'relative',
  'absolute',
  'fixed',
  'sticky',
]

const baseHeight = 128 + 32 + 8 + 2
const borderSizeDivider = 3.58
const spacingEditorPadding = 8

function StylesSubSectionPosition({ cssValues, breakpointCssValues, onChange, disabled }: StylesSubSectionPositionPropsType) {
  const inputMountNodeRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const [expanded, setExpanded] = usePersistedState('styles-sub-section-size-expanded', true)

  const getValue = useCallback((attributeName: string) => breakpointCssValues[attributeName] ?? cssValues[attributeName] ?? cssAttributesMap[attributeName].defaultValue, [breakpointCssValues, cssValues])

  const getTextColor = useCallback((attributeName: string) => (
    typeof breakpointCssValues[attributeName] !== 'undefined'
    && breakpointCssValues[attributeName] !== cssValues[attributeName]
    && breakpointCssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue
      ? 'breakpoint'
      : typeof cssValues[attributeName] !== 'undefined'
      && cssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue
        ? 'primary'
        : 'inherit'
  ), [breakpointCssValues, cssValues])

  // const isToggled = useCallback((attributeName: string, value: CssValueType) => value === getValue(attributeName), [getValue])

  const renderPositionSection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor('position')}
      >
        Position
      </Div>
      <Select
        tiny
        menuOnTop
        value={getValue('position')}
        onChange={event => onChange([{ name: 'position', value: event.target.value }])}
      >
        {positions.map(position => (
          <MenuItem
            slim
            key={position}
            value={position}
          >
            {capitalize(position)}
          </MenuItem>
        ))}
      </Select>
    </Div>
  ), [getTextColor, getValue, onChange])

  const renderPositionEditorSection = useCallback(() => (
    <SpacingEditor
      title=""
      semanticName=""
      onChange={onChange}
      height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
      borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
      offetHorizontal={2}
      inputMountNode={inputMountNodeRef.current}
      cssValues={cssValues}
      breakpointCssValues={breakpointCssValues}
    />
  ), [cssValues, breakpointCssValues, onChange])

  return (
    <Accordion
      ghost
      smallPadding
      smallTitle
      backgroundTitle
      childrenPositionRelative
      title={(
        <StylesSubSectionTitle
          title="Position"
          expanded={expanded}
          cssValues={cssValues}
          breakpointCssValues={breakpointCssValues}
          attributeNames={attributeNames}
        />
      )}
      expanded={expanded}
      onExpand={setExpanded}
    >
      <Div
        xflex="y2s"
        gap={0.5}
      >
        {renderPositionSection()}
        {getValue('position') !== 'static' && renderPositionEditorSection()}
      </Div>
      <div ref={inputMountNodeRef} />
      {disabled && <StylesSubSectionDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionPosition
