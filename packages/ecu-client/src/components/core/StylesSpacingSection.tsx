import { useRef } from 'react'
import { Accordion } from 'honorable'

import { CssValueType, SpacingType, SpacingsType } from '../../types'

import useRefresh from '../../hooks/useRefresh'
import usePersistedState from '../../hooks/usePersistedState'

import SpacingEditor from './SpacingEditor'

type StylesSpacingSectionPropsType = {
  marging: SpacingsType,
  padding: SpacingsType,
  onMarginChange: (attributeName: string, value: SpacingType) => void,
  onPaddingChange: (attributeName: string, value: SpacingType) => void,
  workingCssValues: Record<string, CssValueType>
}

const baseHeight = 128 + 32 + 8 + 2
const borderSizeDivider = 3.58
const spacingEditorPadding = 8

function StylesSpacingSection({ marging, padding, onMarginChange, onPaddingChange, workingCssValues }: StylesSpacingSectionPropsType) {
  const inputMountNodeRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const [expanded, setExpanded] = usePersistedState('styles-spacing-section-expanded', true)

  return (
    <Accordion
      ghost
      smallPadding
      smallTitle
      title="Spacing"
      expanded={expanded}
      onExpand={setExpanded}
    >
      <SpacingEditor
        allowNegativeValues
        title="Margin"
        semanticName="margin"
        value={marging}
        height={baseHeight}
        onChange={onMarginChange}
        borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
        inputMountNode={inputMountNodeRef.current}
        workingCssValues={workingCssValues}
      >
        <SpacingEditor
          title="Padding"
          semanticName="padding"
          value={padding}
          onChange={onPaddingChange}
          height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
          borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
          offetHorizontal={2}
          inputMountNode={inputMountNodeRef.current}
          workingCssValues={workingCssValues}
        />
      </SpacingEditor>
      <div ref={inputMountNodeRef} />
    </Accordion>
  )
}

export default StylesSpacingSection
