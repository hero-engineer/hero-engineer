import { ReactNode } from 'react'
import { Div } from 'honorable'
import { HiPlus } from 'react-icons/hi'
import { CssAttributeType, CssValuesType } from '~types'

import StylesAttributeTitle from './StylesAttributeTitle'

type StylesListPropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  currentBreakpointCssValues: CssValuesType
  attributeName: string
  title: string
  items: ReactNode[]
  onAddItem: () => void
  onChange: (attributes: CssAttributeType[]) => void
}

function StylesList({
  cssValues,
  breakpointCssValues,
  currentBreakpointCssValues,
  attributeName,
  title,
  items,
  onAddItem,
  onChange,
}: StylesListPropsType) {

  return (
    <Div
      xflex="y2s"
      fontSize="0.75rem"
      borderTop="1px solid border"
      px={0.5}
    >
      <Div
        xflex="x5b"
        height={30} // To match a ghost button's height
      >
        <StylesAttributeTitle
          attributeNames={[attributeName]}
          cssValues={cssValues}
          breakpointCssValues={breakpointCssValues}
          currentBreakpointCssValues={currentBreakpointCssValues}
          onChange={onChange}
          width="auto"
        >
          {title}
        </StylesAttributeTitle>
        <Div
          xflex="x5"
          cursor="pointer"
          onClick={onAddItem}
          mr={-0.25}
          p={0.25}
        >
          <HiPlus />
        </Div>
      </Div>
      {!!items.length && (
        <Div
          xflex="y2s"
          backgroundColor="background"
          borderRadius="medium"
          gap={0.25}
        >
          {items}
        </Div>
      )}
    </Div>
  )
}

export default StylesList
