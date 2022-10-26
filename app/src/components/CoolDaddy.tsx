import { Div } from 'ecu-client'

function CoolDaddy({
  children,
}: any) {
  console.log('rendering CoolDaddy')

  return (
    <Div data-ecu="RYplbhv0Mo:0">
      I'm a cool daddy look at me
      {' '}
      {children}
    </Div>
  )
}
export default CoolDaddy
