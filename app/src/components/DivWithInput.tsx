import { useState } from 'react'
import { Div } from 'ecu-client'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div data-ecu="6f8W0JwKpi:0">
      <Div data-ecu="6f8W0JwKpi:0_0">
        Edit me I'm famous
      </Div>
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        data-ecu="6f8W0JwKpi:0_1"
      />
    </Div>
  )
}
export default DivWithInput
