import { useCallback, useEffect, useMemo } from 'react'
import { Accordion, Button, Div, MenuItem, Select } from 'honorable'
import { TfiAlignCenter, TfiAlignJustify, TfiAlignLeft, TfiAlignRight } from 'react-icons/tfi'

import { CssAttributeType, CssValueType, CssValuesType } from '../../types'
import { cssAttributesMap, refetchKeys } from '../../constants'

import { ColorsQuery, ColorsQueryDataType, FontsQuery, FontsQueryDataType } from '../../queries'

import useQuery from '../../hooks/useQuery'
import useRefetch from '../../hooks/useRefetch'
import usePersistedState from '../../hooks/usePersistedState'

import StylesSubSectionTitle from './StylesSubSectionTitle'
import StylesSubSectionDisabledOverlay from './StylesSubSectionDisabledOverlay'
import CssValueInput from './CssValueInput'
import ColorPicker from './ColorPicker'

type StylesSubSectionTypographyPropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  onChange: (attributes: CssAttributeType[]) => void
  disabled: boolean
}

const attributeNames = [
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-align',
  'text-decoration',
  'text-transform',
  'text-shadow',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'color',
]

const textAligns = [
  {
    name: 'left',
    Icon: TfiAlignLeft,
  },
  {
    name: 'center',
    Icon: TfiAlignCenter,
  },
  {
    name: 'right',
    Icon: TfiAlignRight,
  },
  {
    name: 'justify',
    Icon: TfiAlignJustify,
  },
  {
    name: 'inherit',
    Icon: () => <>inherit</>,
  },
]

const defaultWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900]

const prepareFontFamily = (fontName: string) => fontName.includes(' ') ? `"${fontName}", sans-serif` : `${fontName}, sans-serif`

function StylesSubSectionTypography({ cssValues, breakpointCssValues, onChange, disabled }: StylesSubSectionTypographyPropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-typography-expanded', true)

  const [fontsQueryResult, refetchFontsQuery] = useQuery<FontsQueryDataType>({
    query: FontsQuery,
  })
  const [colorsQueryResult, refetchColorsQuery] = useQuery<ColorsQueryDataType>({
    query: ColorsQuery,
  })

  useRefetch(
    {
      key: refetchKeys.fonts,
      refetch: refetchFontsQuery,
    },
  )

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

  const fonts = useMemo(() => fontsQueryResult.data?.fonts ?? [], [fontsQueryResult.data])
  const colors = useMemo(() => colorsQueryResult.data?.colors ?? [], [colorsQueryResult.data])
  const fontFamily = getValue('font-family')
  const weights = useMemo(() => {
    const font = fonts.find(({ name }) => fontFamily === prepareFontFamily(name))

    if (!font) return defaultWeights

    return font.isVariable ? defaultWeights : font.weights
  }, [fonts, fontFamily])

  const renderFamilySection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor('font-family')}
      >
        Typeface
      </Div>
      <Select
        tiny
        menuOnTop
        value={getValue('font-family')}
        onChange={event => onChange([{ name: 'font-family', value: event.target.value }])}
      >
        <MenuItem
          value="inherit"
          fontFamily="inherit"
        >
          inherit
        </MenuItem>
        <MenuItem
          value="sans-serif"
          fontFamily="sans-serif"
        >
          sans-serif
        </MenuItem>
        <MenuItem
          value="serif"
          fontFamily="serif"
        >
          serif
        </MenuItem>
        <MenuItem
          value="monospace"
          fontFamily="monospace"
        >
          monospace
        </MenuItem>
        <MenuItem
          value="cursive"
          fontFamily="cursive"
        >
          cursive
        </MenuItem>
        <MenuItem
          value="fantasy"
          fontFamily="fantasy"
        >
          fantasy
        </MenuItem>
        {fonts.map(font => (
          <MenuItem
            key={font.id}
            value={prepareFontFamily(font.name)}
            fontFamily={prepareFontFamily(font.name)}
          >
            {font.name}
          </MenuItem>
        ))}
      </Select>
    </Div>
  ), [fonts, getTextColor, getValue, onChange])

  const renderWeightsSection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor('font-weight')}
      >
        Weight
      </Div>
      <Select
        tiny
        menuOnTop
        value={getValue('font-weight')}
        // @ts-expect-error
        onChange={event => console.log(event.target.value) || onChange([{ name: 'font-weight', value: event.target.value }])}
      >
        <MenuItem value="inherit">
          inherit
        </MenuItem>
        {weights.map(weight => (
          <MenuItem
            key={weight}
            value={weight.toString()}
          >
            {weight}
          </MenuItem>
        ))}
      </Select>
    </Div>
  ), [weights, getTextColor, getValue, onChange])

  const renderSizeSection = useCallback(() => (
    <Div xflex="x5b">
      <Div
        xflex="x4"
        fontSize="0.75rem"
      >
        <Div
          xflex="x4"
          minWidth={52}
          color={getTextColor('font-size')}
        >
          Size
        </Div>
        <CssValueInput
          allowInherit
          onChange={value => onChange([{ name: 'font-size', value }])}
          value={getValue('font-size').toString()}
        />
      </Div>
      <Div
        xflex="x4"
        fontSize="0.75rem"
      >
        <Div
          xflex="x4"
          minWidth={42}
          color={getTextColor('line-height')}
        >
          Height
        </Div>
        <CssValueInput
          allowInherit
          onChange={value => onChange([{ name: 'line-height', value }])}
          value={getValue('line-height').toString()}
        />
      </Div>
    </Div>
  ), [getTextColor, getValue, onChange])

  const renderColorSection = useCallback(() => {
    const color = getValue('color').toString()

    return (
      <Div
        xflex="x4"
        fontSize="0.75rem"
      >
        <Div
          xflex="x4"
          minWidth={52}
          color={getTextColor('color')}
        >
          Color
        </Div>
        <ColorPicker
          withOverlay
          value={color === 'inherit' ? null : color}
          onChange={value => onChange([{ name: 'color', value }])}
          size={16}
          pickerLeftOffset={-29} // Adjusted from sight
          colors={colors}
        />
        <Button
          ghost
          toggled={color === 'inherit'}
          onClick={() => onChange([{ name: 'color', value: 'inherit' }])}
          ml={0.25}
        >
          inherit
        </Button>
      </Div>
    )
  }, [colors, getTextColor, getValue, onChange])

  const renderAlignSection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor('color')}
      >
        Align
      </Div>
      {textAligns.map(({ name, Icon }) => (
        <Button
          key={name}
          ghost
          toggled={isToggled('text-align', name)}
          onClick={() => onChange([{ name: 'text-align', value: name }])}
        >
          <Icon />
        </Button>
      ))}
    </Div>
  ), [getTextColor, isToggled, onChange])

  // Find the closest weight when the font change
  useEffect(() => {
    const weight = getValue('font-weight').toString()

    if (weight === 'inherit') return

    const numericWeight = parseInt(weight)

    if (weights.includes(numericWeight)) return

    const closestWeight = weights.reduce((previous, current) => Math.abs(current - numericWeight) < Math.abs(previous - numericWeight) ? current : previous, Math.max(...weights))

    // Infinity should never happen
    onChange([{ name: 'font-weight', value: closestWeight }])
  // Add fontFamily as the trigger
  }, [fontFamily, weights, getValue, onChange])

  return (
    <Accordion
      ghost
      smallPadding
      smallTitle
      backgroundTitle
      childrenPositionRelative
      title={(
        <StylesSubSectionTitle
          title="Typography"
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
        {renderFamilySection()}
        {renderWeightsSection()}
        {renderSizeSection()}
        {renderColorSection()}
        {renderAlignSection()}
      </Div>
      {disabled && <StylesSubSectionDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionTypography
