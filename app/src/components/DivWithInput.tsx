import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div data-ecu="MCWuosIpgD:0">
      <Div data-ecu="MCWuosIpgD:0_0">
        Edit me I'm famous
      </Div>
      <CoolDiv key="d14p563cP" />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        data-ecu="MCWuosIpgD:0_1"
      />
    </Div>
  )
}
export default DivWithInput
