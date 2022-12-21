import { memo, useRef } from 'react'
import { Accordion } from 'honorable'

import usePersistedState from '~hooks/usePersistedState'
import useRefresh from '~hooks/useRefresh'

import StylesTitle from '~components/scene-component/panels/styles/StylesTitle'
import SpacingEditor from '~components/scene-component/panels/styles/SpacingEditor'
import StylesDisabledOverlay from '~components/scene-component/panels/styles/StylesDisabledOverlay'

const baseHeight = 128
const borderSizeDivider = 3.45
const spacingEditorPadding = 8

const attributeNames = [
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
]

function StylesSubSectionSpacing() {
  const inputMountNodeRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const [expanded, setExpanded] = usePersistedState('styles-sub-section-spacing-expanded', true)

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
          title="Spacing"
          expanded={expanded}
          attributeNames={attributeNames}
        />
      )}
      expanded={expanded}
      onExpand={setExpanded}
    >
      <SpacingEditor
        allowNegativeValues
        title="Margin"
        semanticName="margin-"
        height={baseHeight}
        borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
        inputMountNode={inputMountNodeRef.current}
      >
        <SpacingEditor
          title="Padding"
          semanticName="padding-"
          height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
          borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
          offetHorizontal={2}
          inputMountNode={inputMountNodeRef.current}
        />
      </SpacingEditor>
      <div ref={inputMountNodeRef} />
      <StylesDisabledOverlay />
    </Accordion>
  )
}

export default memo(StylesSubSectionSpacing)
