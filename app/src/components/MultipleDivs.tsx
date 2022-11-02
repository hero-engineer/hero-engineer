import { Div } from 'ecu-client'

import DualCoolDiv from './DualCoolDiv'
import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <Div data-ecu="ZZX8J-RsH9u:0">
        <CoolDiv />
        <Div data-ecu="ZZX8J-RsH9u:0_0">
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
      <Div data-ecu="ZZX8J-RsH9u:">
        <Div data-ecu="ZZX8J-RsH9u:0">
          Dear component
        </Div>
        <Div data-ecu="ZZX8J-RsH9u:1">
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
