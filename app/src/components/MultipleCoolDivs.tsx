import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function MultipleCoolDivs(props: any) {
  return (
    <Div data-ecu="ZxidRXHE9r:0">
      <CoolDiv />
      <CoolDiv />
      <CoolDiv />
    </Div>
  )
}
export default MultipleCoolDivs
