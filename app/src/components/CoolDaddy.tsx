import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function CoolDaddy({
  children,
}: any) {
  console.log('__rendering CoolDaddy')

  return (
    <Div
      key="chcuCg9kcW"
      data-ecu="7nnNSltGVS:0"
    >
      I'm a cool daddy look at me
      {' '}
      {children}
    </Div>
  )
}
export default CoolDaddy
