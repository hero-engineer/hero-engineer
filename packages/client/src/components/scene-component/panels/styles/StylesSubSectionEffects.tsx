import { memo, useCallback, useContext } from 'react'
import { Accordion, Div, MenuItem, Select } from 'honorable'

import StylesContext from '~contexts/StylesContext'

import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'
import usePersistedState from '~hooks/usePersistedState'

import StylesTitle from '~components/scene-component/panels/styles/StylesTitle'
import StylesAttributeTitle from '~components/scene-component/panels/styles/StylesAttributeTitle'
import StylesDisabledOverlay from '~components/scene-component/panels/styles/StylesDisabledOverlay'

const attributeNames = [
  'cursor',
]

const cursors = [
  'inherit',
  'auto',
  'default',
  'none',
  'context-menu',
  'help',
  'pointer',
  'progress',
  'wait',
  'cell',
  'crosshair',
  'text',
  'vertical-text',
  'alias',
  'copy',
  'move',
  'no-drop',
  'not-allowed',
  'grab',
  'grabbing',
  'all-scroll',
  'col-resize',
  'row-resize',
  'n-resize',
  'e-resize',
  's-resize',
  'w-resize',
  'ne-resize',
  'nw-resize',
  'se-resize',
  'sw-resize',
  'ew-resize',
  'ns-resize',
  'nesw-resize',
  'nwse-resize',
  'zoom-in',
  'zoom-out',
]

function StylesSubSectionEffects() {
  const { onChange } = useContext(StylesContext)
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-effects-expanded', true)

  const { getValue, updateCssAttribute } = useStylesSubSectionHelpers()

  const renderCursorSection = useCallback(() => (
    <Div xflex="x4s">
      <StylesAttributeTitle attributeNames={['cursor']}>
        Cursor
      </StylesAttributeTitle>
      <Select
        tiny
        menuOnTop
        value={getValue('cursor')}
        onChange={event => onChange([updateCssAttribute('cursor', event.target.value)])}
      >
        {cursors.map(cursor => (
          <MenuItem
            slim
            key={cursor}
            value={cursor}
            ChildrenProps={{ cursor }}
          >
            {cursor}
          </MenuItem>
        ))}
      </Select>
    </Div>
  ), [getValue, updateCssAttribute, onChange])

  return (
    <Accordion
      ghost
      backgroundTitle
      smallTitle
      smallTitlePadding
      noChildrenPadding
      childrenPositionRelative
      expanded={expanded}
      onExpand={setExpanded}
      title={(
        <StylesTitle
          title="Effects"
          expanded={expanded}
          attributeNames={attributeNames}
        />
      )}
    >
      <Div
        xflex="y2s"
        fontSize="0.75rem"
        gap={0.5}
        p={0.5}
      >
        {renderCursorSection()}
      </Div>
      <StylesDisabledOverlay />
    </Accordion>
  )
}

export default memo(StylesSubSectionEffects)
