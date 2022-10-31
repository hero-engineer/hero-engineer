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
      <DualCoolDiv />
      <Div data-ecu="iOAD93LOMP3:0">
        <Div data-ecu="iOAD93LOMP3:0_0">
          Dear component
        </Div>
        <Div data-ecu="iOAD93LOMP3:0_1">
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
