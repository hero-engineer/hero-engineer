import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <CoolDaddy>
        <Div data-ecu="3A8RbidHid:0">
          Yo
        </Div>
      </CoolDaddy>
      <CoolDaddy>
        <CoolDaddy>
          <CoolDiv />
        </CoolDaddy>
      </CoolDaddy>
      <Div data-ecu="3A8RbidHid:1">
        <CoolDiv />
        <Div data-ecu="3A8RbidHid:1_0">
          <CoolDaddy>
            <CoolDaddy>
              <CoolDaddy>
                Darling
                <CoolDiv />
              </CoolDaddy>
              <CoolDiv />
            </CoolDaddy>
          </CoolDaddy>
        </Div>
      </Div>
      <DualCoolDiv />
      <CoolDiv />
      <DualCoolDiv />
      <Div data-ecu="3A8RbidHid:2">
        <Div data-ecu="3A8RbidHid:2_0">
          Dear component
        </Div>
        <Div data-ecu="3A8RbidHid:2_1">
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
