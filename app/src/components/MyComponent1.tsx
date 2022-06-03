import { Div, P } from 'honorable'

function MyComponent1(props: any) {
  const { children, otherProps } = props

  return (
    <Div {...otherProps}>
      <P>Component1</P>
      {children}
    </Div>
  )
}

export default MyComponent1
