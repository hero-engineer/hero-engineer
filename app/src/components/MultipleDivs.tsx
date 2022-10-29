import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <>
          <CoolDiv key="EihRPzDi9" />
          <CoolDiv key="o6n8vjKdkZ" />
        </>
        <>
          <CoolDiv key="ZwOm0DQ3SA" />
          <CoolDiv key="rwxeK4pcoR" />
        </>
      </>
      <Div
        key="ftRpYGyRyu"
        data-ecu="4i8RUnflxL:0"
      >
        <Div
          key="duzEPQqT_e"
          data-ecu="4i8RUnflxL:0_0"
        >
          Dear component
        </Div>
        <Div
          key="0NW7awIRyb"
          data-ecu="4i8RUnflxL:0_1"
        >
          Hello
        </Div>
        <CoolDaddy key="RZUkAnUqKY">
          Darling

        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
