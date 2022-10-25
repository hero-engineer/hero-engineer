import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function MultipleDivs(props: any) {
  return (
    <Div data-ecu="MgmS1xuQQf:0">
      <CoolDiv />
      <CoolDiv />
      <Div data-ecu="MgmS1xuQQf:0_0">
        Edit me I'm famous
      </Div>
      <CoolDiv />
      <Div data-ecu="MgmS1xuQQf:0_1">
        Edit me I'm famous
      </Div>
      <Div data-ecu="MgmS1xuQQf:0_2">
        <CoolDiv />
        Edit me I'm famous
      </Div>
      <Div data-ecu="MgmS1xuQQf:0_3" />
      <Div data-ecu="MgmS1xuQQf:0_4">
        <CoolDiv />
        Edit me I'm famous
      </Div>
      <CoolDiv />
    </Div>
  )
}
export default MultipleDivs
