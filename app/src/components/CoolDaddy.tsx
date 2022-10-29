import { Div } from 'ecu-client'

function CoolDaddy({
  children,
}: any) {
  console.log('__rendering CoolDaddy')

  return (
    <Div
      data-ecu-hierarchy="vYjiWt9R4t:0"
      key="KOE7hec2m"
      data-ecu="cPNjJUMNPv:0"
    >
      I'm a cool daddy look at me
      {' '}
      {children}
    </Div>
  )
}
export default CoolDaddy
