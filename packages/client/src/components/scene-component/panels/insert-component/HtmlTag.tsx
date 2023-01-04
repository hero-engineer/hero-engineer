import { Div } from 'honorable'

type HtmlTagPropsType = {
  tag: string
}

function HtmlTag({ tag }: HtmlTagPropsType) {
  return (
    <Div
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
