import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function MultipleCoolDivs(props: any) {
  return (
    <Div data-ecu="fwXCZ4-JXb:0">
      <CoolDiv />
      <CoolDiv /><CoolDiv /><CoolDiv /><CoolDiv /><CoolDiv /><CoolDiv />
      <CoolDiv />
    </Div>
  )
}
export default MultipleCoolDivs
