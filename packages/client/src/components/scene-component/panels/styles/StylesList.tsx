import { ReactNode } from 'react'
import { Div } from 'honorable'
import { HiPlus } from 'react-icons/hi'

import StylesAttributeTitle from '~components/scene-component/panels/styles/StylesAttributeTitle'

type StylesListPropsType = {
  title: string
  items: ReactNode[]
  attributeName: string
  onAddItem: () => void
}

function StylesList({
  title,
  items,
  attributeName,
  onAddItem,
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
        height={31} // To match a ghost button's height
      >
        <StylesAttributeTitle
          attributeNames={[attributeName]}
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
