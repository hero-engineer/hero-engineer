import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DualCoolDiv(props: any) {
  console.log('__rendering DualCoolDiv')

  return (
    <>
      <Div data-ecu="XvcE1oC52g:0">
        Edit me I'm famous 1
      </Div>
      <CoolDiv />
    </>
  )
}
export default DualCoolDiv
