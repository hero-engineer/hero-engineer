import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div data-ecu="Efv46o1EHd:0">
      <Div data-ecu="Efv46o1EHd:0_0">
        Edit me I'm famous
      </Div>
      <CoolDiv />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        data-ecu="Efv46o1EHd:0_1"
      />
    </Div>
  )
}
export default DivWithInput
