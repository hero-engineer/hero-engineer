import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  return (
    <>
      <Div
        key="7TXhXm-0fxE"
        data-ecu="y1EwJ-WCGF:0"
      >
        <Div
          key="3an3ISklfLo"
          data-ecu="y1EwJ-WCGF:0_0"
        >
          Dear component
        </Div>
        <CoolDaddy key="DFH_LqvIU45">
          <Div
            key="75KZGTMFmUj"
            data-ecu="y1EwJ-WCGF:0_1"
          >
            Hello
          </Div>
        </CoolDaddy>
        <CoolDaddy key="p5HrcokEY06">
          Darling

        </CoolDaddy>
        <CoolDiv key="8Fsg0A3v4ZT" />
      </Div>
      <CoolDiv key="cVt0qokIGLu" />
    </>
  )
}
export default MultipleDivs
