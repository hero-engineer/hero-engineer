import { Div } from 'ecu-client'

function CoolDaddy({
  children,
}: any) {
  console.log('__rendering CoolDaddy')

  return (
    <Div data-ecu="Vj9JHiEMli:0">
      I'm a cool daddy look at me
      {' '}
      {children}
    </Div>
  )
}
export default CoolDaddy
