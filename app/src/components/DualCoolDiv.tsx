import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DualCoolDiv(props: any) {
  console.log('__rendering DualCoolDiv')

  return (
    <>
      <Div data-ecu="Fwg9xpgIAJ:0">
        Edit me I'm famous!
      </Div>
      <CoolDiv />
    </>
  )
}
export default DualCoolDiv
