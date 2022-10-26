import { Div } from 'ecu-client'

function CoolDaddy({
  children,
}: any) {
  console.log('rendering CoolDaddy')

  return (
    <Div data-ecu="6FiqUv1amb:0">
      I'm a cool daddy look at me
      {' '}
      {children}
    </Div>
  )
}
export default CoolDaddy
