import { useCallback, useEffect, useMemo } from 'react'
import { Accordion, Button, Div, MenuItem, Select, Tooltip } from 'honorable'
import { TfiAlignCenter, TfiAlignJustify, TfiAlignLeft, TfiAlignRight } from 'react-icons/tfi'
import { BsTypeItalic } from 'react-icons/bs'
import { RxOverline, RxStrikethrough, RxUnderline } from 'react-icons/rx'
import { MdClose } from 'react-icons/md'

import CssValueInput from '../../css/CssValueInput'
import ColorPicker from '../../css/ColorPicker'

import StylesSubSectionTitle from './StylesSubSectionTitle'
import StylesSubSectionDisabledOverlay from './StylesSubSectionDisabledOverlay'

import { CssAttributeType, CssValuesType } from '@types'

import { refetchKeys } from '@constants'

import { ColorsQuery, ColorsQueryDataType, FontsQuery, FontsQueryDataType } from '@queries'

import useQuery from '@hooks/useQuery'
import useRefetch from '@hooks/useRefetch'
import usePersistedState from '@hooks/usePersistedState'
import useStylesSubSectionHelpers from '@hooks/useStylesSubSectionHelpers'

import capitalize from '@utils/capitalize'

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

const fontStyles = [
  {
    name: 'normal',
    Icon: () => <BsTypeItalic style={{ transform: 'skewX(10deg)' }} />,
  },
  {
    name: 'italic',
    Icon: BsTypeItalic,
  },
  {
    name: 'inherit',
    Icon: () => <>inherit</>,
  },
]

const textDecorations = [
  {
    name: 'none',
    Icon: MdClose,
  },
  {
    name: 'underline',
    Icon: RxUnderline,
  },
  {
    name: 'overline',
    Icon: RxOverline,
  },
  {
    name: 'line-through',
    Icon: RxStrikethrough,
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
    {
      key: refetchKeys.colors,
      refetch: refetchColorsQuery,
    }
  )

  const { getValue, getTextColor, isToggled } = useStylesSubSectionHelpers(cssValues, breakpointCssValues)

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
        color={getTextColor(['font-family'])}
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
        color={getTextColor(['font-weight'])}
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
          color={getTextColor(['font-size'])}
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
          color={getTextColor(['line-height'])}
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
          color={getTextColor(['color'])}
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
        color={getTextColor(['text-align'])}
      >
        Align
      </Div>
      {textAligns.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('text-align', [name])}
            onClick={() => onChange([{ name: 'text-align', value: name }])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [getTextColor, isToggled, onChange])

  const renderItalicSection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor(['font-style'])}
      >
        Italic
      </Div>
      {fontStyles.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('font-style', [name])}
            onClick={() => onChange([{ name: 'font-style', value: name }])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [getTextColor, isToggled, onChange])

  const renderDecorationSection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor(['text-decoration'])}
      >
        Line
      </Div>
      {textDecorations.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('text-decoration', [name])}
            onClick={() => onChange([{ name: 'text-decoration', value: name }])}
          >
            <Icon />
          </Button>
        </Tooltip>
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
      backgroundTitle
      smallTitle
      smallTitlePadding
      smallChildrenPadding
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
        {renderItalicSection()}
        {renderDecorationSection()}
      </Div>
      {disabled && <StylesSubSectionDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionTypography
