import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <>
          <CoolDiv key="QsFXqaL8Q" />
          <CoolDiv key="PV2CIX_RGl" />
        </>
        <CoolDiv key="FlFGR1lY1-" />
      </>
      <Div
        key="_Ie_OmKd10"
        data-ecu="4i8RUnflxL:0"
      >
        <Div
          key="1udXRh6igG"
          data-ecu="4i8RUnflxL:0_0"
        >
          Dear component
        </Div>
        <CoolDiv key="viiJgdoXF2" />
        <Div
          key="3cchQJ18G0"
          data-ecu="4i8RUnflxL:0_1"
        >
          Hello
        </Div>
        <CoolDaddy key="u1yBgyuP8P">
          Darling
        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
