import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  return (
    <>
      <Div data-ecu="02CA4cVTtT:0">
        <CoolDaddy>
          <CoolDaddy>
            <CoolDiv />
          </CoolDaddy>
        </CoolDaddy>
      </Div>
      <Div data-ecu="02CA4cVTtT:1">
        <CoolDaddy>
          <Div data-ecu="02CA4cVTtT:1_0">
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
      <Div data-ecu="02CA4cVTtT:2">
        <Div data-ecu="02CA4cVTtT:2_0">
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
      <Div data-ecu="02CA4cVTtT:3">
        <Div data-ecu="02CA4cVTtT:3_0">
          Dear component
        </Div>
        <Div data-ecu="02CA4cVTtT:3_1">
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
