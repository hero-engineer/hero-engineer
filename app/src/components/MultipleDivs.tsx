import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <CoolDiv />
      <DualCoolDiv />
      <CoolDiv />
      <Div data-ecu="w4rVWe0h6dz:0">
        <Div data-ecu="w4rVWe0h6dz:0_0">
          Dear component
        </Div>
        <Div data-ecu="w4rVWe0h6dz:0_1">
          Hello
        </Div>
        <CoolDiv />
        <CoolDaddy>
          Darling
        </CoolDaddy>
      </Div>
      <CoolDiv />
    </>
  )
}
export default MultipleDivs
