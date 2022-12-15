import { useRef } from 'react'
import { Accordion } from 'honorable'

import useRefresh from '~hooks/useRefresh'
import usePersistedState from '~hooks/usePersistedState'

import StylesTitle from '~core/full-ast/panels/styles/StylesTitle'
import SpacingEditor from '~core/full-ast/panels/styles/SpacingEditor'
import StylesDisabledOverlay from '~core/full-ast/panels/styles/StylesDisabledOverlay'
import { StylesSubSectionPropsType } from '~core/full-ast/panels/styles/StylesSubSectionPropsType'

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

function StylesSubSectionSpacing({ attributes, breakpointAttributes, onChange, isDisabled }: StylesSubSectionPropsType) {
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
          attributes={attributes}
          breakpointAttributes={breakpointAttributes}
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
        onChange={onChange}
        borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
        inputMountNode={inputMountNodeRef.current}
        attributes={attributes}
        breakpointAttributes={breakpointAttributes}
      >
        <SpacingEditor
          title="Padding"
          semanticName="padding-"
          onChange={onChange}
          height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
          borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
          offetHorizontal={2}
          inputMountNode={inputMountNodeRef.current}
          attributes={attributes}
          breakpointAttributes={breakpointAttributes}
        />
      </SpacingEditor>
      <div ref={inputMountNodeRef} />
      {isDisabled && <StylesDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionSpacing
