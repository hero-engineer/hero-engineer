import { createContext } from 'react'

import { CssAttributeType, NormalizedCssAttributesType } from '~types'

export type StylesContextType = {
  attributes: NormalizedCssAttributesType
  breakpointAttributes: NormalizedCssAttributesType
  currentBreakpointAttributes: NormalizedCssAttributesType
  fullBreakpointAttributes: NormalizedCssAttributesType
  onChange: (attributes: CssAttributeType[]) => void
  isDisabled: boolean
}

export default createContext<StylesContextType>({
  attributes: {},
  breakpointAttributes: {},
  currentBreakpointAttributes: {},
  fullBreakpointAttributes: {},
  onChange: () => {},
  isDisabled: false,
})
