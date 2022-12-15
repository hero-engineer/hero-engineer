import { useCallback, useMemo, useRef } from 'react'
import { Accordion, Div, MenuItem, Select } from 'honorable'

import useRefresh from '~hooks/useRefresh'
import usePersistedState from '~hooks/usePersistedState'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

import capitalize from '~utils/capitalize'

import StylesDisabledOverlay from '~core/full-ast/panels/styles/StylesDisabledOverlay'
import SpacingEditor from '~core/full-ast/panels/styles/SpacingEditor'
import StylesAttributeTitle from '~core/full-ast/panels/styles/StylesAttributeTitle'
import StylesTitle from '~core/full-ast/panels/styles/StylesTitle'
import { StylesSubSectionPropsType } from '~core/full-ast/panels/styles/StylesSubSectionPropsType'

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

function StylesSubSectionPosition({ attributes, breakpointAttributes, currentBreakpointAttributes, onChange, isDisabled }: StylesSubSectionPropsType) {
  const inputMountNodeRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const [expanded, setExpanded] = usePersistedState('styles-sub-section-position-expanded', true)

  const { getValue, updateCssAttribute } = useStylesSubSectionHelpers(attributes, breakpointAttributes)

  const attributeTitleProps = useMemo(() => ({
    attributes,
    breakpointAttributes,
    currentBreakpointAttributes,
    onChange,
  }), [attributes, breakpointAttributes, currentBreakpointAttributes, onChange])

  const renderPositionSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle
        attributeNames={['position']}
        {...attributeTitleProps}
      >
        Position
      </StylesAttributeTitle>
      <Select
        tiny
        menuOnTop
        value={getValue('position')}
        onChange={event => onChange([updateCssAttribute('position', event.target.value)])}
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
  ), [attributeTitleProps, getValue, updateCssAttribute, onChange])

  const renderPositionEditorSection = useCallback(() => (
    <SpacingEditor
      title=""
      semanticName=""
      onChange={onChange}
      height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
      borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
      offetHorizontal={2}
      inputMountNode={inputMountNodeRef.current}
      attributes={attributes}
      breakpointAttributes={breakpointAttributes}
    />
  ), [attributes, breakpointAttributes, onChange])

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
          title="Position"
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
        {renderPositionSection()}
        {getValue('position') !== 'static' && renderPositionEditorSection()}
      </Div>
      <div ref={inputMountNodeRef} />
      {isDisabled && <StylesDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionPosition
