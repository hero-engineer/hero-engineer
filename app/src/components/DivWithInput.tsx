import { useState } from 'react'
import { Div } from 'ecu-client'

function DivWithInput(props: any) {
  const [name, setName] = useState('Cool')

  return (
    <Div data-ecu="J3gJEU6YP_:0">
      <Div data-ecu="J3gJEU6YP_:0_0">
        Edit me I'm famous
      </Div>
      <input
        value={name}
        onChange={event => setName(event.target.value)}
        data-ecu="J3gJEU6YP_:0_1"
      />
    </Div>
  )
}
export default DivWithInput
