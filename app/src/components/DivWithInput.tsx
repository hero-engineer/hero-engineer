import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div data-ecu="AjyYyeM7lh:0">
      <Div data-ecu="AjyYyeM7lh:0_0">
        Edit me I'm famous
      </Div>
      <CoolDiv />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        data-ecu="AjyYyeM7lh:0_1"
      />
    </Div>
  )
}
export default DivWithInput
