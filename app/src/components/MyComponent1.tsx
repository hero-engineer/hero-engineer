import { Div, P } from 'honorable'

function MyComponent1(props: any) {
  const { children, otherProps } = props

  return (
    <Div {...otherProps}>
      <P>Component1 before</P>
      {children}
      <P>Component1 after</P>
    </Div>
  )
}

export default MyComponent1
