import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <CoolDiv key="6Mkvtp8DP" />
        <CoolDiv key="QGRGWie0KH" />
      </>
      <Div
        key="B20KWNcS0S"
        data-ecu="4i8RUnflxL:0"
      >
        <Div
          key="ngepqp_20p"
          data-ecu="4i8RUnflxL:0_0"
        >
          Dear component
        </Div>
        
        <Div
          key="Xia-1kTWUk"
          data-ecu="4i8RUnflxL:0_1"
        >
          Hello
        </Div>
        <CoolDaddy key="gIgaujIRrP">
          Darling
          
        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
