import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      {/* <CoolDaddy>
        <Div data-ecu="4ERI2Hl9eEi:0">
          Yo
        </Div>
       </CoolDaddy> */}
      <CoolDaddy>
        <CoolDaddy>
          <Div data-ecu="67TdI5MSruE:0">
            Yo Yo
          </Div>
        </CoolDaddy>
      </CoolDaddy>
      {/* <Div data-ecu="T3R5wB-mGIF:2">
        <CoolDiv />
        <Div data-ecu="T3R5wB-mGIF:2_0">
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
       <Div data-ecu="T3R5wB-mGIF:3">
        <Div data-ecu="T3R5wB-mGIF:3_0">
          Dear component
        </Div>
        <Div data-ecu="T3R5wB-mGIF:3_1">
          Hello
        </Div>
        <CoolDiv />
        <CoolDaddy>
          Darling
        </CoolDaddy>
       </Div>
       <CoolDiv /> */}
    </>
  )
}
export default MultipleDivs
