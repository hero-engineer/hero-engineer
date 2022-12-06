import { useCallback, useRef } from 'react'
import { Accordion, Div, MenuItem, Select } from 'honorable'

import StylesSubSectionTitle from './StylesSubSectionTitle'
import SpacingEditor from './SpacingEditor'
import StylesSubSectionDisabledOverlay from './StylesSubSectionDisabledOverlay'

import { CssAttributeType, CssValuesType } from '@types'

import useRefresh from '@hooks/useRefresh'
import usePersistedState from '@hooks/usePersistedState'
import useStyleSubSectionHelpers from '@hooks/useStyleSubSectionHelpers'

import capitalize from '@utils/capitalize'

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

  const [expanded, setExpanded] = usePersistedState('styles-sub-section-position-expanded', true)

  const { getValue, getTextColor } = useStyleSubSectionHelpers(cssValues, breakpointCssValues)

  const renderPositionSection = useCallback(() => (
    <Div
      xflex="x4"
      fontSize="0.75rem"
    >
      <Div
        xflex="x4"
        minWidth={52}
        color={getTextColor(['position'])}
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
