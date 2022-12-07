import { useRef } from 'react'
import { Accordion } from 'honorable'

import { CssAttributeType, CssValuesType } from '@types'

import useRefresh from '@hooks/useRefresh'
import usePersistedState from '@hooks/usePersistedState'

import StylesSubSectionTitle from './StylesSubSectionTitle'
import SpacingEditor from './SpacingEditor'
import StylesDisabledOverlay from './StylesDisabledOverlay'

type StylesSubSectionSpacingPropsType = {
  onChange: (attributes: CssAttributeType[]) => void,
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  currentBreakpointCssValues: CssValuesType
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

function StylesSubSectionSpacing({ cssValues, breakpointCssValues, currentBreakpointCssValues, onChange, disabled }: StylesSubSectionSpacingPropsType) {
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
        semanticName="margin-"
        height={baseHeight}
        onChange={onChange}
        borderSize={baseHeight / borderSizeDivider - spacingEditorPadding}
        inputMountNode={inputMountNodeRef.current}
        cssValues={cssValues}
        breakpointCssValues={breakpointCssValues}
      >
        <SpacingEditor
          title="Padding"
          semanticName="padding-"
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
      {disabled && <StylesDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionSpacing
