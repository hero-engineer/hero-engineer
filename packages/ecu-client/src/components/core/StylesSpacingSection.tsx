import { Accordion } from 'honorable'

import usePersistedState from '../../hooks/usePersistedState'

import SpacingEditor, { SpacingEditorValueType } from './SpacingEditor'

type StylesSpacingSectionPropsType = {
  margings: [SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType],
  paddings: [SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType],
  onMarginChange: (value: [SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType]) => void,
  onPaddingChange: (value: [SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType, SpacingEditorValueType]) => void,
}

const baseHeight = 128 + 32 + 8 + 2
const borderSizeDivider = 3.58
const spacingEditorPadding = 8

function StylesSpacingSection({ margings, paddings, onMarginChange, onPaddingChange }: StylesSpacingSectionPropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-spacing-section-expanded', true)

  return (
    <Accordion
      ghost
      smallPadding
      title="Spacing"
      expanded={expanded}
      onExpand={setExpanded}
      mt={0.5}
    >
      <SpacingEditor
        title="Margin"
        value={margings}
        onChange={onMarginChange}
        height={baseHeight}
        borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
      >
        <SpacingEditor
          title="Padding"
          value={paddings}
          onChange={onPaddingChange}
          height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
          borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
          offetHorizontal={2}
        />
      </SpacingEditor>
    </Accordion>
  )
}

export default StylesSpacingSection
