import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <CoolDaddy>
        <Div data-ecu="A_zAyt8iJRV:0">
          Yo
        </Div>
      </CoolDaddy>
      <CoolDaddy>
        <CoolDaddy>
          <CoolDiv />
        </CoolDaddy>
      </CoolDaddy>
      <Div data-ecu="A_zAyt8iJRV:1">
        <Div data-ecu="A_zAyt8iJRV:1_0">
          <CoolDaddy>
            <CoolDaddy>
              <CoolDaddy>
                Darling
                <CoolDiv />
              </CoolDaddy>
            </CoolDaddy>
          </CoolDaddy>
        </Div>
      </Div>
      <DualCoolDiv />
      <CoolDiv />
      <DualCoolDiv />
      <Div data-ecu="A_zAyt8iJRV:2">
        <Div data-ecu="A_zAyt8iJRV:2_0">
          Dear component
        </Div>
        <Div data-ecu="A_zAyt8iJRV:2_1">
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
