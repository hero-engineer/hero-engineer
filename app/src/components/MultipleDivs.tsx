import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  return (
    <>
      <Div data-ecu="o1V_Nz4XqP:0">
        <CoolDaddy>
          <CoolDaddy>
            <CoolDiv />
          </CoolDaddy>
        </CoolDaddy>
      </Div>
      <Div data-ecu="o1V_Nz4XqP:1">
        <CoolDaddy>
          <Div data-ecu="o1V_Nz4XqP:1_0">
            Yo
          </Div>
          <CoolDaddy>
            <CoolDiv />
            <CoolDiv />
          </CoolDaddy>
          <CoolDiv />
          <CoolDiv />
        </CoolDaddy>
      </Div>
      <CoolDaddy>
        <CoolDaddy>
          <CoolDiv />
        </CoolDaddy>
      </CoolDaddy>
      <Div data-ecu="o1V_Nz4XqP:2">
        <Div data-ecu="o1V_Nz4XqP:2_0">
          <CoolDaddy>
            <CoolDaddy>
              <CoolDaddy>
                <Div data-ecu="o1V_Nz4XqP:2_0_0">
                  Darling
                </Div>
              </CoolDaddy>
            </CoolDaddy>
          </CoolDaddy>
        </Div>
      </Div>
      <DualCoolDiv />
      <DualCoolDiv />
      <Div data-ecu="o1V_Nz4XqP:3">
        <Div data-ecu="o1V_Nz4XqP:3_0">
          Dear component
        </Div>
        <Div data-ecu="o1V_Nz4XqP:3_1">
          Hello
        </Div>
        <CoolDiv />
        <CoolDaddy>
          <Div data-ecu="o1V_Nz4XqP:3_2">
            Darling
          </Div>
        </CoolDaddy>
      </Div>
    </>
  )
}

export default MultipleDivs
