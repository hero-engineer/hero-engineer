import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <Div data-ecu="UDSGxmZE6jN:0">
        <CoolDaddy>
          <Div data-ecu="UDSGxmZE6jN:0_0">
            Yo
          </Div>
          <CoolDiv />
        </CoolDaddy>
      </Div>
      <CoolDaddy>
        Yo
        <CoolDaddy>
          <CoolDiv />
        </CoolDaddy>
      </CoolDaddy>
      <Div data-ecu="UDSGxmZE6jN:1">
        <Div data-ecu="UDSGxmZE6jN:1_0">
          <CoolDaddy>
            <CoolDaddy>
              <CoolDaddy>
                Darling
              </CoolDaddy>
            </CoolDaddy>
          </CoolDaddy>
        </Div>
      </Div>
      <DualCoolDiv />
      <DualCoolDiv />
      <Div data-ecu="UDSGxmZE6jN:2">
        <Div data-ecu="UDSGxmZE6jN:2_0">
          Dear component
        </Div>
        <Div data-ecu="UDSGxmZE6jN:2_1">
          Hello
        </Div>
        <CoolDiv />
        <CoolDaddy>
          Darling
        </CoolDaddy>
      </Div>
      
    </>
  )
}
export default MultipleDivs
