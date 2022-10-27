import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  return (
    <Div data-ecu="PtC5gWCdd5:0">
      <Div data-ecu="PtC5gWCdd5:0_0">
        Dear component
      </Div>
      <CoolDiv />
      <CoolDiv />
      <CoolDiv />
      <CoolDiv />
      <CoolDiv />
      <CoolDiv />
      <Div data-ecu="PtC5gWCdd5:0_1">
        Hello
      </Div>
      <CoolDaddy key="gKn17pwO6O8">
        Darling
      </CoolDaddy>
    </Div>
  )
}
export default MultipleDivs
