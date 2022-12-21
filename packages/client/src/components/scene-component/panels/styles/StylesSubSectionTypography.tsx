import { ReactNode, memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { Accordion, Button, Div, MenuItem, Select, Tooltip } from 'honorable'
import { TfiAlignCenter, TfiAlignJustify, TfiAlignLeft, TfiAlignRight } from 'react-icons/tfi'
import { BsTypeItalic } from 'react-icons/bs'
import { RxLetterCaseCapitalize, RxLetterCaseLowercase, RxLetterCaseUppercase, RxOverline, RxStrikethrough, RxUnderline } from 'react-icons/rx'
import { MdClose, MdOutlineFormatTextdirectionLToR, MdOutlineFormatTextdirectionRToL } from 'react-icons/md'

import getTypefaces from '~processors/css/getTypefaces'
import getColors from '~processors/css/getColors'

import StylesContext from '~contexts/StylesContext'

import usePersistedState from '~hooks/usePersistedState'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'
import useAsync from '~hooks/useAsync'

import capitalize from '~utils/capitalize'

import StylesList from '~components/scene-component/panels/styles/StylesList'
import StylesAttributeTitle from '~components/scene-component/panels/styles/StylesAttributeTitle'
import StylesTitle from '~components/scene-component/panels/styles/StylesTitle'
import StylesDisabledOverlay from '~components/scene-component/panels/styles/StylesDisabledOverlay'
import CssValueInput from '~components/css-inputs/CssValueInput'
import ColorPicker from '~components/css-inputs/ColorPicker'

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
]

const textTransforms = [
  {
    name: 'none',
    Icon: MdClose,
  },
  {
    name: 'uppercase',
    Icon: RxLetterCaseUppercase,
  },
  {
    name: 'capitalize',
    Icon: RxLetterCaseCapitalize,
  },
  {
    name: 'lowercase',
    Icon: RxLetterCaseLowercase,
  },
]

const directions = [
  {
    name: 'ltr',
    Icon: MdOutlineFormatTextdirectionLToR,
  },
  {
    name: 'rtl',
    Icon: MdOutlineFormatTextdirectionRToL,
  },
]

const whiteSpaces = [
  'normal',
  'nowrap',
  'pre',
  'pre-wrap',
  'pre-line',
  'break-spaces',
]

const defaultWeights = [400, 700]

const prepareFontFamily = (fontName: string) => fontName.includes(' ') ? `"${fontName}", sans-serif` : `${fontName}, sans-serif`

function StylesSubSectionTypography() {
  const { onChange } = useContext(StylesContext)

  const [expanded, setExpanded] = usePersistedState('styles-sub-section-typography-expanded', true)

  const { getValue, isToggled, updateCssAttribute } = useStylesSubSectionHelpers()

  const typefaces = useAsync(getTypefaces, [])
  const colors = useAsync(getColors, [])
  const fontFamily = getValue('font-family')
  const weights = useMemo(() => {
    const typeface = typefaces?.find(({ name }) => fontFamily === prepareFontFamily(name))

    return typeface?.weights ?? defaultWeights
  }, [typefaces, fontFamily])

  const renderInheritButton = useCallback((attributeName: string) => (
    <>
      <Div flexGrow />
      <Tooltip label="Inherit from parent">
        <Button
          ghost
          toggled={isToggled(attributeName, ['inherit'])}
          onClick={() => onChange([updateCssAttribute(attributeName, 'inherit')])}
        >
          inherit
        </Button>
      </Tooltip>
    </>
  ), [isToggled, updateCssAttribute, onChange])

  const renderFamilySection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['font-family']}>
        Typeface
      </StylesAttributeTitle>
      <Select
        tiny
        menuOnTop
        value={getValue('font-family')}
        onChange={event => onChange([updateCssAttribute('font-family', event.target.value)])}
        SelectedProps={{
          fontFamily: getValue('font-family'),
        }}
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
        {typefaces?.map(typeface => (
          <MenuItem
            key={typeface.url}
            value={prepareFontFamily(typeface.name)}
            fontFamily={prepareFontFamily(typeface.name)}
          >
            {typeface.name}
          </MenuItem>
        ))}
      </Select>
    </Div>
  ), [typefaces, getValue, updateCssAttribute, onChange])

  const renderWeightsSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['font-weight']}>
        Weight
      </StylesAttributeTitle>
      <Select
        tiny
        menuOnTop
        value={getValue('font-weight')}
        onChange={event => onChange([updateCssAttribute('font-weight', event.target.value)])}
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
  ), [weights, getValue, updateCssAttribute, onChange])

  const renderSizeSection = useCallback(() => (
    <Div xflex="x5b">
      <Div
        xflex="x4"
        fontSize="0.75rem"
      >
        <StylesAttributeTitle
          attributeNames={['font-size']}
        >
          Size
        </StylesAttributeTitle>
        <CssValueInput
          allowInherit
          onChange={value => onChange([updateCssAttribute('font-size', value)])}
          value={getValue('font-size').toString()}
        />
      </Div>
      <Div
        xflex="x4"
        fontSize="0.75rem"
      >
        <StylesAttributeTitle
          attributeNames={['line-height']}
          minWidth={46}
        >
          Height
        </StylesAttributeTitle>
        <CssValueInput
          allowInherit
          onChange={value => onChange([updateCssAttribute('line-height', value)])}
          value={getValue('line-height').toString()}
        />
      </Div>
    </Div>
  ), [getValue, updateCssAttribute, onChange])

  const renderColorSection = useCallback(() => {
    const color = getValue('color').toString()

    return (
      <Div
        xflex="x4"
        fontSize="0.75rem"
      >
        <StylesAttributeTitle attributeNames={['color']}>
          Color
        </StylesAttributeTitle>
        <ColorPicker
          withOverlay
          value={color === 'inherit' ? null : color}
          onChange={value => onChange([updateCssAttribute('color', value)])}
          size={16}
          pickerLeftOffset={-29} // Adjusted from sight
          colors={colors ?? []}
        />
        {renderInheritButton('color')}
      </Div>
    )
  }, [colors, renderInheritButton, getValue, updateCssAttribute, onChange])

  const renderAlignSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['text-align']}>
        Align
      </StylesAttributeTitle>
      {textAligns.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('text-align', [name])}
            onClick={() => onChange([updateCssAttribute('text-align', name)])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
      {renderInheritButton('text-align')}
    </Div>
  ), [renderInheritButton, isToggled, updateCssAttribute, onChange])

  const renderItalicSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['font-style']}>
        Italic
      </StylesAttributeTitle>
      {fontStyles.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('font-style', [name])}
            onClick={() => onChange([updateCssAttribute('font-style', name)])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
      {renderInheritButton('font-style')}
    </Div>
  ), [renderInheritButton, isToggled, updateCssAttribute, onChange])

  const renderDecorationSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['text-decoration']}>
        Line
      </StylesAttributeTitle>
      {textDecorations.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('text-decoration', [name])}
            onClick={() => onChange([updateCssAttribute('text-decoration', name)])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
      {renderInheritButton('text-decoration')}
    </Div>
  ), [renderInheritButton, isToggled, updateCssAttribute, onChange])

  const renderSpacingSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['letter-spacing']}>
        Spacing
      </StylesAttributeTitle>
      <CssValueInput
        allowInherit
        value={getValue('letter-spacing').toString()}
        onChange={value => onChange([updateCssAttribute('letter-spacing', value)])}
      />
    </Div>
  ), [getValue, updateCssAttribute, onChange])

  const renderTransformSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['text-transform']}>
        Case
      </StylesAttributeTitle>
      {textTransforms.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('text-transform', [name])}
            onClick={() => onChange([updateCssAttribute('text-transform', name)])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
      {renderInheritButton('text-transform')}
    </Div>
  ), [renderInheritButton, isToggled, updateCssAttribute, onChange])

  const renderDirectionSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['direction']}>
        Direction
      </StylesAttributeTitle>
      {directions.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('direction', [name])}
            onClick={() => onChange([updateCssAttribute('direction', name)])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
      {renderInheritButton('direction')}
    </Div>
  ), [renderInheritButton, isToggled, updateCssAttribute, onChange])

  const renderWhiteSpaceSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['white-space']}>
        Breaking
      </StylesAttributeTitle>
      <Select
        tiny
        menuOnTop
        value={getValue('white-space')}
        onChange={event => onChange([updateCssAttribute('white-space', event.target.value)])}
      >
        <MenuItem value="inherit">
          inherit
        </MenuItem>
        {whiteSpaces.map(whiteSpace => (
          <MenuItem
            key={whiteSpace}
            value={whiteSpace}
          >
            {whiteSpace}
          </MenuItem>
        ))}
      </Select>
    </Div>
  ), [getValue, updateCssAttribute, onChange])

  const renderShadowSection = useCallback(() => {
    const items: ReactNode[] = []

    return (
      <StylesList
        title="Text shadow"
        attributeName="text-shadow"
        items={items}
        onAddItem={() => {}}
      />
    )
  }, [])

  // Find the closest weight when the font change
  useEffect(() => {
    const weight = getValue('font-weight').toString()

    if (weight === 'inherit') return

    const numericWeight = parseInt(weight)

    if (weights.includes(numericWeight)) return

    const closestWeight = weights.reduce((previous, current) => Math.abs(current - numericWeight) < Math.abs(previous - numericWeight) ? current : previous, Math.max(...weights))

    onChange([updateCssAttribute('font-weight', closestWeight)])
  // Add fontFamily as the trigger
  }, [fontFamily, weights, getValue, updateCssAttribute, onChange])

  return (
    <Accordion
      ghost
      backgroundTitle
      smallTitle
      smallTitlePadding
      noChildrenPadding
      childrenPositionRelative
      title={(
        <StylesTitle
          title="Typography"
          expanded={expanded}
          attributeNames={attributeNames}
        />
      )}
      expanded={expanded}
      onExpand={setExpanded}
    >
      <Div
        xflex="y2s"
        fontSize="0.75rem"
        gap={0.5}
        p={0.5}
      >
        {renderFamilySection()}
        {renderWeightsSection()}
        {renderSizeSection()}
        {renderColorSection()}
        {renderAlignSection()}
        {renderItalicSection()}
        {renderDecorationSection()}
        {renderSpacingSection()}
        {renderTransformSection()}
        {renderDirectionSection()}
        {renderWhiteSpaceSection()}
      </Div>
      {renderShadowSection()}
      <StylesDisabledOverlay />
    </Accordion>
  )
}

export default memo(StylesSubSectionTypography)
