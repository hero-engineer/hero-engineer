import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DualCoolDiv(props: any) {
  return (
    <>
      <Div data-ecu="1LENTSL6vx:0">
        Edit me I'm famous!
      </Div>
      <CoolDiv />
    </>
  )
}

export default DualCoolDiv
