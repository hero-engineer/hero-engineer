import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div
      key="2WLN892WFs"
      data-ecu="SiO9EYpq_w:0"
    >
      <Div
        key="2y56JvYc7I"
        data-ecu="SiO9EYpq_w:0_0"
      >
        Edit me I'm famous
      </Div>
      <CoolDiv key="7de7S98s5J" />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        key="eC-xTwNcZt"
      />
    </Div>
  )
}
export default DivWithInput
