import { useMemo, useRef } from 'react'
import { Accordion } from 'honorable'

import { cssAttributesMap, spacingSemanticValues } from '../../constants'
import { CssAttributeType, CssValuesType, SpacingsType } from '../../types'

import useRefresh from '../../hooks/useRefresh'
import usePersistedState from '../../hooks/usePersistedState'

import SpacingEditor from './SpacingEditor'
import StylesSubSectionTitle from './StylesSubSectionTitle'
import StylesSubSectionDisabledOverlay from './StylesSubSectionDisabledOverlay'

type StylesSpacingSectionPropsType = {
  onChange: (attributes: CssAttributeType[]) => void,
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  disabled: boolean
}

const baseHeight = 128 + 32 + 8 + 2
const borderSizeDivider = 3.58
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

function StylesSubSectionSpacing({ cssValues, breakpointCssValues, onChange, disabled }: StylesSpacingSectionPropsType) {
  const inputMountNodeRef = useRef<HTMLDivElement>(null)

  useRefresh()

  const [expanded, setExpanded] = usePersistedState('styles-spacing-section-expanded', true)

  const margin = useMemo(() => spacingSemanticValues.map(spacingSemanticValue => `margin-${spacingSemanticValue}`).map(key => cssValues[key] ?? cssAttributesMap[key].defaultValue) as SpacingsType, [cssValues])
  const padding = useMemo(() => spacingSemanticValues.map(spacingSemanticValue => `padding-${spacingSemanticValue}`).map(key => cssValues[key] ?? cssAttributesMap[key].defaultValue) as SpacingsType, [cssValues])

  return (
    <Accordion
      ghost
      smallPadding
      smallTitle
      backgroundTitle
      childrenPositionRelative
      title={(
        <StylesSubSectionTitle
          title="Spacing"
          expanded={expanded}
          cssValues={cssValues}
          breakpointCssValues={breakpointCssValues}
          attributeNames={attributeNames}
        />
      )}
      expanded={expanded}
      onExpand={setExpanded}
    >
      <SpacingEditor
        allowNegativeValues
        title="Margin"
        semanticName="margin"
        value={margin}
        height={baseHeight}
        onChange={onChange}
        borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
        inputMountNode={inputMountNodeRef.current}
        cssValues={cssValues}
        breakpointCssValues={breakpointCssValues}
      >
        <SpacingEditor
          title="Padding"
          semanticName="padding"
          value={padding}
          onChange={onChange}
          height={(borderSizeDivider - 2) * baseHeight / borderSizeDivider + spacingEditorPadding}
          borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
          offetHorizontal={2}
          inputMountNode={inputMountNodeRef.current}
          cssValues={cssValues}
          breakpointCssValues={breakpointCssValues}
        />
      </SpacingEditor>
      <div ref={inputMountNodeRef} />
      {disabled && <StylesSubSectionDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionSpacing
