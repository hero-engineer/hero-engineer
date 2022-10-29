import { Div } from 'ecu-client'

function CoolDaddy({
  children,
}: any) {
  console.log('__rendering CoolDaddy')

  return (
    <Div data-ecu="g3EF40nHl2:0">
      I'm a cool daddy look at me
      {' '}
      {children}
    </Div>
  )
}
export default CoolDaddy
