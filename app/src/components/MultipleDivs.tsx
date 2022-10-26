import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  return (
    <Div data-ecu="r2LaQ9P8Sv:0">
      <Div data-ecu="r2LaQ9P8Sv:0_0">
        Hello
      </Div>
      <Div data-ecu="r2LaQ9P8Sv:0_1">
        Shield powa!
      </Div>
      <CoolDiv />
      <CoolDiv />
      <CoolDaddy>
        Darling
      </CoolDaddy>
    </Div>
  )
}
export default MultipleDivs
