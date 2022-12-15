import { useCallback, useMemo } from 'react'
import { Accordion, Button, Div, Tooltip } from 'honorable'
import { AiOutlineColumnHeight, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import usePersistedState from '~hooks/usePersistedState'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

import capitalize from '~utils/capitalize'

import CssValueInput from '~core/css/CssValueInput'
import StylesTitle from '~core/full-ast/panels/styles/StylesTitle'
import StylesAttributeTitle from '~core/full-ast/panels/styles/StylesAttributeTitle'
import StylesDisabledOverlay from '~core/full-ast/panels/styles/StylesDisabledOverlay'
import { StylesSubSectionPropsType } from '~core/full-ast/panels/styles/StylesSubSectionPropsType'

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

function StylesSubSectionSize({ attributes, breakpointAttributes, currentBreakpointAttributes, onChange, isDisabled }: StylesSubSectionPropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-size-expanded', true)

  const { getValue, isToggled, updateCssAttribute } = useStylesSubSectionHelpers(attributes, breakpointAttributes)

  const attributeTitleProps = useMemo(() => ({
    attributes,
    breakpointAttributes,
    currentBreakpointAttributes,
    onChange,
  }), [attributes, breakpointAttributes, currentBreakpointAttributes, onChange])

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
        onChange={value => onChange([updateCssAttribute(attributeName, value)])}
      />
    </Div>
  ), [attributeTitleProps, getValue, updateCssAttribute, onChange])

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
            onClick={() => onChange([updateCssAttribute('overflow', name)])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [attributeTitleProps, isToggled, updateCssAttribute, onChange])

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
          attributes={attributes}
          breakpointAttributes={breakpointAttributes}
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
      {isDisabled && <StylesDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionSize
