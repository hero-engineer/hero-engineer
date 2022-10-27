import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

function CoolDaddy({
  children,
}: any) {
  console.log('rendering CoolDaddy')

  return (
    <Div
      key="o8DQjFPs6"
      data-ecu="A2y3ewqwcu:0"
    >
      I'm a cool daddy look at me
      {' '}
      {children}
      
    </Div>
  )
}
export default CoolDaddy
