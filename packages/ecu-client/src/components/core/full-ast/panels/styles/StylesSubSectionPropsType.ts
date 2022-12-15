import { CssAttributeType, NormalizedCssAttributesType } from '~types'

export type StylesSubSectionPropsType = {
  attributes: NormalizedCssAttributesType
  breakpointAttributes: NormalizedCssAttributesType
  currentBreakpointAttributes: NormalizedCssAttributesType
  onChange: (attributes: CssAttributeType[]) => void
  isDisabled: boolean
}
