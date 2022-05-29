import { Div } from 'honorable'

function Foo(props: any) {
  return (
    <Div>
      {props.children}
    </Div>
  )
}

export default Foo