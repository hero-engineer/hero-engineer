import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div
      key="xPZUDh1skh"
      data-ecu="k18JZDfCaz:0"
    >
      <Div
        key="s7DdXqD3yQ"
        data-ecu="k18JZDfCaz:0_0"
      >
        Edit me I'm famous
      </Div>
      <CoolDiv key="rZh5BvyT2d" />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        key="upV0oG96Fn"
      />
    </Div>
  )
}
export default DivWithInput
