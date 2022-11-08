import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  return (
    <>
      <Div data-ecu="rnx97ptZj8:0">
        <CoolDaddy>
          <Div data-ecu="rnx97ptZj8:0_0">
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
      <Div data-ecu="rnx97ptZj8:1">
        <Div data-ecu="rnx97ptZj8:1_0">
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
      <Div data-ecu="rnx97ptZj8:2">
        <Div data-ecu="rnx97ptZj8:2_0">
          Dear component
        </Div>
        <Div data-ecu="rnx97ptZj8:2_1">
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
