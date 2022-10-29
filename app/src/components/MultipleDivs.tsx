import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <CoolDiv />
      <Div data-ecu="qfSXyoREqi:0">
        <Div data-ecu="qfSXyoREqi:0_0">
          Dear component
        </Div>
        <Div data-ecu="qfSXyoREqi:0_1">
          Hello
        </Div>
        
        <CoolDaddy>
          Darling
          
        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
