import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <CoolDiv />
      <CoolDiv />
      
      <Div data-ecu="E6QYcM6ieL:0">
        <Div data-ecu="E6QYcM6ieL:0_0">
          Dear component
        </Div>
        <Div data-ecu="E6QYcM6ieL:0_1">
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
