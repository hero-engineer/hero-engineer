import { useState } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div
      data-ecu-hierarchy="VwCP6nVhF_:0"
      key="y_XI0HIma"
      data-ecu="OkAIE4X77R:0"
    >
      <Div
        data-ecu-hierarchy="VwCP6nVhF_:0_0"
        key="t7pTqd_NRA"
        data-ecu="OkAIE4X77R:0_0"
      >
        Edit me I'm famous
      </Div>
      <CoolDiv key="hbc12lOJY5" />
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        key="tzTROFtR-X"
      />
    </Div>
  )
}
export default DivWithInput
