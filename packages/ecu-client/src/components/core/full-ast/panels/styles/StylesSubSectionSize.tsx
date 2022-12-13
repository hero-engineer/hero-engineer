import { useCallback, useMemo } from 'react'
import { Accordion, Button, Div, Tooltip } from 'honorable'
import { AiOutlineColumnHeight, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import { CssAttributeType, CssValuesType } from '~types'

import usePersistedState from '~hooks/usePersistedState'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

import capitalize from '~utils/capitalize'

import CssValueInput from '~core/css/CssValueInput'
import StylesTitle from '~core/full-ast/panels/styles/StylesTitle'
import StylesAttributeTitle from '~core/full-ast/panels/styles/StylesAttributeTitle'
import StylesDisabledOverlay from '~core/full-ast/panels/styles/StylesDisabledOverlay'

type StylesSubSectionSizePropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  currentBreakpointCssValues: CssValuesType
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

function StylesSubSectionSize({ cssValues, breakpointCssValues, currentBreakpointCssValues, onChange, disabled }: StylesSubSectionSizePropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-size-expanded', true)

  const { getValue, isToggled } = useStylesSubSectionHelpers(cssValues, breakpointCssValues)

  const attributeTitleProps = useMemo(() => ({
    cssValues,
    breakpointCssValues,
    currentBreakpointCssValues,
    onChange,
  }), [cssValues, breakpointCssValues, currentBreakpointCssValues, onChange])

  const renderSizeInput = useCallback((attributeName: string, label: string) => (
    <Div xflex="x4">
      <StylesAttributeTitle
        attributeNames={[attributeName]}
        width={42}
        {...attributeTitleProps}
      >
        {label}
      </StylesAttributeTitle>
      <CssValueInput
        value={getValue(attributeName).toString()}
        onChange={value => onChange([{ name: attributeName, value }])}
      />
    </Div>
  ), [attributeTitleProps, getValue, onChange])

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
    <Div xflex="x4">
      <StylesAttributeTitle
        attributeNames={['overflow']}
        {...attributeTitleProps}
      >
        Overflow
      </StylesAttributeTitle>
      {overflows.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={capitalize(name)}
        >
          <Button
            ghost
            toggled={isToggled('overflow', [name])}
            onClick={() => onChange([{ name: 'overflow', value: name }])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [attributeTitleProps, isToggled, onChange])

  return (
    <Accordion
      ghost
      backgroundTitle
      smallTitle
      smallTitlePadding
      smallChildrenPadding
      childrenPositionRelative
      title={(
        <StylesTitle
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
        fontSize="0.75rem"
        gap={0.5}
      >
        <Div xflex="x2b">
          {renderSizeSection('width')}
          {renderSizeSection('height')}
        </Div>
        {renderOverflowSection()}
      </Div>
      {disabled && <StylesDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionSize
