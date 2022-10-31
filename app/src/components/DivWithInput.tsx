import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div data-ecu="JPECpM5PXy:0">
      <Div data-ecu="JPECpM5PXy:0_0">
        Edit me I'm DivWithInput
      </Div>
      <CoolDiv />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
      />
    </Div>
  )
}
export default DivWithInput
