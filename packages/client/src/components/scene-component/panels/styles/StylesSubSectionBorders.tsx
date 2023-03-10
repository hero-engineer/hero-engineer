import { memo, useCallback, useContext, useState } from 'react'
import { Accordion, Button, Div, MenuItem, Select } from 'honorable'
import { CgBorderAll, CgBorderBottom, CgBorderLeft, CgBorderRight, CgBorderTop } from 'react-icons/cg'
import { TbBorderRadius } from 'react-icons/tb'

import StylesContext from '~contexts/StylesContext'

import usePersistedState from '~hooks/usePersistedState'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

import capitalize from '~utils/capitalize'

import StylesTitle from '~components/scene-component/panels/styles/StylesTitle'
import StylesAttributeTitle from '~components/scene-component/panels/styles/StylesAttributeTitle'
import StylesDisabledOverlay from '~components/scene-component/panels/styles/StylesDisabledOverlay'
import CssValueInput from '~components/css-inputs/CssValueInput'
import ColorPicker from '~components/css-inputs/ColorPicker'

const borderAttributeNames = [
  'border-style',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-width',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
]

const borderRadiusAttributeNames = [
  'border-radius',
  'border-radius-top-left',
  'border-radius-top-right',
  'border-radius-bottom-left',
  'border-radius-bottom-right',
]

const attributeNames = [
  ...borderAttributeNames,
  ...borderRadiusAttributeNames,
]

const borderStyles = [
  'none',
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
  'hidden',
]

function StylesSubSectionBorders() {
  const { onChange } = useContext(StylesContext)

  const [expanded, setExpanded] = usePersistedState('styles-sub-section-borders-expanded', true)
  const [selectedBorder, setSelectedBorder] = useState('border')

  const { getTextColor, getValue, updateCssAttribute } = useStylesSubSectionHelpers()

  const renderBorderStyleSection = useCallback(() => (
    <Div xflex="x4s">
      <StylesAttributeTitle
        attributeNames={[`${selectedBorder}-style`]}
        width={36}
      >
        Style
      </StylesAttributeTitle>
      <Select
        tiny
        menuOnTop
        flexGrow
        minWidth="auto"
        width="auto"
        maxWidth="none"
        value={getValue(`${selectedBorder}-style`)}
        onChange={event => onChange([updateCssAttribute(`${selectedBorder}-style`, event.target.value)])}
      >
        {borderStyles.map(borderStyle => (
          <MenuItem
            slim
            key={borderStyle}
            value={borderStyle}
          >
            {capitalize(borderStyle)}
          </MenuItem>
        ))}
      </Select>
    </Div>
  ), [
    selectedBorder,
    getValue,
    onChange,
    updateCssAttribute,
  ])

  const renderBorderWidthSection = useCallback(() => (
    <Div xflex="x4s">
      <StylesAttributeTitle
        attributeNames={[`${selectedBorder}-width`]}
        width={36}
      >
        Width
      </StylesAttributeTitle>
      <CssValueInput
        flexGrow
        width="auto"
        maxWidth={109} // Adjusted from sight
        value={getValue(`${selectedBorder}-width`)}
        onChange={value => onChange([updateCssAttribute(`${selectedBorder}-width`, value)])}
      />
    </Div>
  ), [
    selectedBorder,
    getValue,
    onChange,
    updateCssAttribute,
  ])

  const renderBorderColorSection = useCallback(() => (
    <Div xflex="x4s">
      <StylesAttributeTitle
        attributeNames={[`${selectedBorder}-color`]}
        width={36}
      >
        Color
      </StylesAttributeTitle>
      <ColorPicker
        withOverlay
        value={getValue(`${selectedBorder}-color`)}
        onChange={value => onChange([updateCssAttribute(`${selectedBorder}-color`, value)])}
        pickerLeftOffset={-104} // Adjusted from sight
        flexGrow
        width="auto"
        maxWidth={109} // Adjusted from sight
      />
    </Div>
  ), [
    selectedBorder,
    getValue,
    onChange,
    updateCssAttribute,
  ])

  const renderBorderSection = useCallback(() => (
    <Div
      xflex="y2s"
      gap={0.25}
    >
      <StylesAttributeTitle attributeNames={borderAttributeNames}>
        Border
      </StylesAttributeTitle>
      <Div
        xflex="x4s"
        gap={0.25}
      >
        <Div xflex="y2s">
          <Div xflex="x5s">
            <Button
              ghost
              toggled={selectedBorder === 'border-top'}
              onClick={() => setSelectedBorder('border-top')}
              color={getTextColor(['border-top-style', 'border-top-width', 'border-top-color'])}
            >
              <CgBorderTop />
            </Button>
          </Div>
          <Div xflex="x5s">
            <Button
              ghost
              toggled={selectedBorder === 'border-left'}
              onClick={() => setSelectedBorder('border-left')}
              color={getTextColor(['border-left-style', 'border-left-width', 'border-left-color'])}
            >
              <CgBorderLeft />
            </Button>
            <Button
              ghost
              toggled={selectedBorder === 'border'}
              onClick={() => setSelectedBorder('border')}
              color={getTextColor(['border-style', 'border-width', 'border-color'])}
            >
              <CgBorderAll />
            </Button>
            <Button
              ghost
              toggled={selectedBorder === 'border-right'}
              onClick={() => setSelectedBorder('border-right')}
              color={getTextColor(['border-right-style', 'border-right-width', 'border-right-color'])}
            >
              <CgBorderRight />
            </Button>
          </Div>
          <Div xflex="x5s">
            <Button
              ghost
              toggled={selectedBorder === 'border-bottom'}
              onClick={() => setSelectedBorder('border-bottom')}
              color={getTextColor(['border-bottom-style', 'border-bottom-width', 'border-bottom-color'])}
            >
              <CgBorderBottom />
            </Button>
          </Div>
        </Div>
        <Div
          xflex="y5s"
          flexGrow
          gap={0.5}
        >
          {renderBorderStyleSection()}
          {renderBorderWidthSection()}
          {renderBorderColorSection()}
        </Div>
      </Div>
    </Div>
  ), [
    selectedBorder,
    getTextColor,
    renderBorderStyleSection,
    renderBorderWidthSection,
    renderBorderColorSection,
  ])

  const renderBorderRadiusSection = useCallback(() => (
    <Div
      xflex="y2s"
      gap={0.5}
    >
      <StylesAttributeTitle attributeNames={borderRadiusAttributeNames}>
        Radius
      </StylesAttributeTitle>
      <Div xflex="x4s">
        <StylesAttributeTitle
          attributeNames={['border-radius']}
          width={36}
        >
          <CgBorderAll style={{ marginTop: 2 }} />
        </StylesAttributeTitle>
        <CssValueInput
          value={getValue('border-radius')}
          onChange={value => onChange([updateCssAttribute('border-radius', value)])}
        />
      </Div>
      <Div
        xflex="x4s"
        gap={1}
      >
        <Div xflex="x4s">
          <StylesAttributeTitle
            attributeNames={['border-radius-top-left']}
            width={36}
          >
            <TbBorderRadius style={{ marginTop: 2 }} />
          </StylesAttributeTitle>
          <CssValueInput
            value={getValue('border-radius-top-left')}
            onChange={value => onChange([updateCssAttribute('border-radius-top-left', value)])}
          />
        </Div>
        <Div xflex="x4s">
          <StylesAttributeTitle
            attributeNames={['border-radius-top-right']}
            width={36}
          >
            <TbBorderRadius style={{ marginTop: 2, transform: 'rotate(90deg)' }} />
          </StylesAttributeTitle>
          <CssValueInput
            value={getValue('border-radius-top-right')}
            onChange={value => onChange([updateCssAttribute('border-radius-top-right', value)])}
          />
        </Div>
      </Div>
      <Div
        xflex="x4s"
        gap={1}
      >
        <Div xflex="x4s">
          <StylesAttributeTitle
            attributeNames={['border-radius-bottom-left']}
            width={36}
          >
            <TbBorderRadius style={{ marginTop: 2, transform: 'rotate(-90deg)' }} />
          </StylesAttributeTitle>
          <CssValueInput
            value={getValue('border-radius-bottom-left')}
            onChange={value => onChange([updateCssAttribute('border-radius-bottom-left', value)])}
          />
        </Div>
        <Div xflex="x4s">
          <StylesAttributeTitle
            attributeNames={['border-radius-bottom-right']}
            width={36}
          >
            <TbBorderRadius style={{ marginTop: 2, transform: 'rotate(180deg)' }} />
          </StylesAttributeTitle>
          <CssValueInput
            value={getValue('border-radius-bottom-right')}
            onChange={value => onChange([updateCssAttribute('border-radius-bottom-right', value)])}
          />
        </Div>
      </Div>
    </Div>
  ), [getValue, onChange, updateCssAttribute])

  return (
    <Accordion
      ghost
      backgroundTitle
      smallTitle
      smallTitlePadding
      smallChildrenPadding
      childrenPositionRelative
      expanded={expanded}
      onExpand={setExpanded}
      title={(
        <StylesTitle
          title="Borders"
          expanded={expanded}
          attributeNames={attributeNames}
        />
      )}
    >
      <Div
        xflex="y2s"
        fontSize="0.75rem"
        gap={0.5}
      >
        {renderBorderSection()}
        {renderBorderRadiusSection()}
      </Div>
      <StylesDisabledOverlay />
    </Accordion>
  )
}

export default memo(StylesSubSectionBorders)
