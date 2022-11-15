/* --
  * IMPORTS START
-- */
import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

/* --
  * IMPORTS END
-- */
/* --
  * TYPES START
-- */

type MultipleDivsPropsType = Record<string, never>;
/* --
  * TYPES END
-- */

function MultipleDivs(props: MultipleDivsPropsType) {
  return (
    <>
      <Div data-ecu="l-nRISr0f6:0">
        <CoolDaddy>
          <CoolDaddy>
            <CoolDiv />
            <CoolDiv />
          </CoolDaddy>
        </CoolDaddy>
      </Div>
      <Div data-ecu="l-nRISr0f6:1">
        <CoolDaddy>
          <CoolDiv />
          <CoolDaddy><CoolDiv /></CoolDaddy>
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <CoolDiv />
          <Div data-ecu="l-nRISr0f6:1_0">
            Yo
          </Div>
          <CoolDiv />
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
      <Div data-ecu="l-nRISr0f6:2">
        <Div data-ecu="l-nRISr0f6:2_0">
          <CoolDaddy>
            <CoolDaddy>
              <CoolDiv />
              <CoolDaddy>
                <Div data-ecu="l-nRISr0f6:2_0_0">
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
      <Div data-ecu="l-nRISr0f6:3">
        <Div data-ecu="l-nRISr0f6:3_0">
          Dear component
        </Div>
        <Div data-ecu="l-nRISr0f6:3_1">
          Hello
        </Div>
        <CoolDiv />
        <CoolDaddy>
          <Div data-ecu="l-nRISr0f6:3_2">
            Darling
          </Div>
        </CoolDaddy>
      </Div>
    </>
  )
}

export default MultipleDivs
