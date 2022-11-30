import { useCallback } from 'react'
import { Accordion, Button, Div, Tooltip } from 'honorable'

import usePersistedState from '../../hooks/usePersistedState'
import { CssAttributeType, CssValueType, CssValuesType } from '../../types'
import { cssAttributesMap } from '../../constants'

import capitalize from '../../utils/capitalize'

import CssValueInput from './CssValueInput'
import StylesSubSectionTitle from './StylesSubSectionTitle'
import StylesSubSectionDisabledOverlay from './StylesSubSectionDisabledOverlay'

type StylesSubSectionSizePropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  onChange: (attributes: CssAttributeType[]) => void
  disabled: boolean
}

function addDefaults(attributeNames: string[]) {
  const attributes: CssAttributeType[] = []

  attributeNames.forEach(name => {
    const attribute = cssAttributesMap[name]

    if (attribute) {
      attributes.push({
        name,
        value: attribute.defaultValue,
      })
    }
  })

  return attributes
}

const attributeNames = [
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'overflow',
]

function StylesSubSectionSize({ cssValues, breakpointCssValues, onChange, disabled }: StylesSubSectionSizePropsType) {
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

  const isToggled = useCallback((attributeName: string, value: CssValueType) => value === getValue(attributeName), [getValue])

  const renderSizeInput = useCallback((attributeName: string, label: string) => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={42}
        color={getTextColor(attributeName)}
      >
        {label}
      </Div>
      <CssValueInput
        value={getValue(attributeName).toString()}
        onChange={value => onChange([{ name: attributeName, value }])}
      />
    </Div>
  ), [getTextColor, getValue, onChange])

  const renderSizeSection = useCallback((attributeName: string) => (
    <Div
      xflex="y2s"
      gap={0.25}
    >
      {renderSizeInput(attributeName, capitalize(attributeName))}
      {renderSizeInput(`min-${attributeName}`, 'Min')}
      {renderSizeInput(`max-${attributeName}`, 'Max')}
    </Div>
  ), [renderSizeInput])

  return (
    <Accordion
      ghost
      smallPadding
      smallTitle
      backgroundTitle
      childrenPositionRelative
      title={(
        <StylesSubSectionTitle
          title="Size"
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
        gap={0.25}
      >
        <Div xflex="x2b">
          {renderSizeSection('width')}
          {renderSizeSection('height')}
        </Div>
      </Div>
      {disabled && <StylesSubSectionDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionSize
