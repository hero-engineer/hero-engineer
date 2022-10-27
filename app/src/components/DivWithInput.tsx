import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div
      key="645lZzl8u5"
      data-ecu="WbeVv_5CWF:0"
    >
      <Div
        key="5R8PJ6N3rz"
        data-ecu="WbeVv_5CWF:0_0"
      >
        Edit me I'm famous
      </Div>
      <CoolDiv key="R6O5MiJb-I" />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        key="tpHGFQvUbx"
      />
    </Div>
  )
}
export default DivWithInput
