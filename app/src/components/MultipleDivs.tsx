import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <Div data-ecu="-2v-Lb2A13c:0">
        <CoolDaddy>
          <Div data-ecu="-2v-Lb2A13c:0_0">
            Yo
          </Div>
          <CoolDiv />
        </CoolDaddy>
      </Div>
      <CoolDaddy>
        <CoolDaddy>
          <CoolDiv />
        </CoolDaddy>
      </CoolDaddy>
      {/* <Div data-ecu="XN1uagYO1eE:0">
        <Div data-ecu="XN1uagYO1eE:0_0">
          <CoolDaddy>
            <CoolDaddy>
              <CoolDaddy>
                Darling
              </CoolDaddy>
            </CoolDaddy>
          </CoolDaddy>
        </Div>
       </Div> */}
      {/* <DualCoolDiv />
       <DualCoolDiv /> */}
      {/* <Div data-ecu="DZOBkQXz7K:2">
        <Div data-ecu="DZOBkQXz7K:2_0">
          Dear component
        </Div>
        <Div data-ecu="DZOBkQXz7K:2_1">
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
