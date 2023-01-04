import { useRef } from 'react'
import { Div } from 'honorable'
import { useDrag } from 'react-dnd'

import { InsertedNodeDragItemType } from '~types'

type HtmlTagPropsType = {
  tag: string
}

function HtmlTag({ tag }: HtmlTagPropsType) {
  const rootRef = useRef<HTMLDivElement>(null)

  const [, drag] = useDrag<InsertedNodeDragItemType, void, void>(() => ({
    type: 'InsertedNode',
    item: () => ({
      type: 'html-tag',
      name: tag,
    }),
  }), [tag])

  drag(rootRef)

  return (
    <Div
      ref={rootRef}
      xflex="x5"
      border="1px solid border"
      cursor="pointer"
      userSelect="none"
      p={1}
    >
      {tag}
    </Div>
  )
}

export default HtmlTag
