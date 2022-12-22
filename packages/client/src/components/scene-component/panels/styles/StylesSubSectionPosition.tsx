import { memo, useCallback, useContext, useRef } from 'react'
import { Accordion, Div, MenuItem, Select } from 'honorable'

import StylesContext from '~contexts/StylesContext'

import useRefresh from '~hooks/useRefresh'
import usePersistedState from '~hooks/usePersistedState'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

import capitalize from '~utils/capitalize'

import StylesTitle from '~components/scene-component/panels/styles/StylesTitle'
import StylesAttributeTitle from '~components/scene-component/panels/styles/StylesAttributeTitle'
import SpacingEditor from '~components/scene-component/panels/styles/SpacingEditor'
import StylesDisabledOverlay from '~components/scene-component/panels/styles/StylesDisabledOverlay'

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

function StylesSubSectionPosition() {
  const inputMountNodeRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const { onChange } = useContext(StylesContext)

  const [expanded, setExpanded] = usePersistedState('styles-sub-section-position-expanded', true)

  const { getValue, updateCssAttribute } = useStylesSubSectionHelpers()

  const renderPositionSection = useCallback(() => (
    <Div xflex="x4">
      <StylesAttributeTitle attributeNames={['position']}>
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
  ), [getValue, updateCssAttribute, onChange])

  const renderPositionEditorSection = useCallback(() => (
    <SpacingEditor
      title=""
      semanticName=""
      height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
      borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
      offetHorizontal={2}
      inputMountNode={inputMountNodeRef.current}
    />
  ), [])

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
          title="Position"
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
        {renderPositionSection()}
        {getValue('position') !== 'static' && renderPositionEditorSection()}
      </Div>
      <div ref={inputMountNodeRef} />
      <StylesDisabledOverlay />
    </Accordion>
  )
}

export default memo(StylesSubSectionPosition)
