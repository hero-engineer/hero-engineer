import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  return (
    <>
      <Div data-ecu="-LQr-6NtT4:0">
        <CoolDaddy>
          <CoolDaddy>
            <CoolDiv />
            <CoolDiv />
          </CoolDaddy>
        </CoolDaddy>
      </Div>
      <Div data-ecu="-LQr-6NtT4:1">
        <CoolDaddy>
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <Div data-ecu="-LQr-6NtT4:1_0">
            Yo
          </Div>
          <CoolDiv />
          <CoolDiv />
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
      <Div data-ecu="-LQr-6NtT4:2">
        <Div data-ecu="-LQr-6NtT4:2_0">
          <CoolDaddy>
            <CoolDaddy>
              <CoolDiv />
              <CoolDaddy>
                <Div data-ecu="-LQr-6NtT4:2_0_0">
                  Darling
                </Div>
              </CoolDaddy>
              <CoolDiv />
              <CoolDiv />
              <CoolDiv />
              <CoolDiv />
            </CoolDaddy>
          </CoolDaddy>
        </Div>
      </Div>
      <DualCoolDiv />
      <DualCoolDiv />
      <Div data-ecu="-LQr-6NtT4:3">
        <Div data-ecu="-LQr-6NtT4:3_0">
          Dear component
        </Div>
        <Div data-ecu="-LQr-6NtT4:3_1">
          Hello
        </Div>
        <CoolDiv />
        <CoolDaddy>
          <Div data-ecu="-LQr-6NtT4:3_2">
            Darling
          </Div>
        </CoolDaddy>
      </Div>
    </>
  )
}

export default MultipleDivs
