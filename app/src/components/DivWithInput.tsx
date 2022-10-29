import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div
      key="JVr3TTYdr0"
      data-ecu="zwwpNa63am:0"
    >
      <Div
        key="XKtHOs0Z-e"
        data-ecu="zwwpNa63am:0_0"
      >
        Edit me I'm famous
      </Div>
      <CoolDiv key="Axq1CWNkIt" />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        key="m8BXGQDGH3"
      />
    </Div>
  )
}
export default DivWithInput
