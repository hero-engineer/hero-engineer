import { useCallback } from 'react'
import { Accordion, Button, Div, Tooltip } from 'honorable'
import { AiOutlineColumnHeight, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

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

const attributeNames = [
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'overflow',
]

const overflows = [
  {
    name: 'visible',
    Icon: AiOutlineEye,
  },
  {
    name: 'hidden',
    Icon: AiOutlineEyeInvisible,
  },
  {
    name: 'scroll',
    Icon: AiOutlineColumnHeight,
  },
  {
    name: 'auto',
    Icon: () => <>auto</>,
  },
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
        minWidth={38}
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

  const renderOverflowSection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor('overflow')}
      >
        Overflow
      </Div>
      {overflows.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
          placement="top"
        >
          <Button
            ghost
            toggled={isToggled('overflow', name)}
            onClick={() => onChange([{ name: 'overflow', value: name }])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [getTextColor, isToggled, onChange])

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
        {renderOverflowSection()}
      </Div>
      {disabled && <StylesSubSectionDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionSize
