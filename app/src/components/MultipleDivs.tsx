import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <CoolDiv />
        <>
          <>
            <CoolDiv />
            <CoolDiv />
          </>
          <>
            <CoolDiv />
            <CoolDiv />
          </>
        </>
      </>
      <Div data-ecu="XCMFz3-v44:0">
        <Div data-ecu="XCMFz3-v44:0_0">
          Dear component
        </Div>
        <Div data-ecu="XCMFz3-v44:0_1">
          Hello
        </Div>
        <CoolDiv />
        <CoolDaddy>
          Darling
          
        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
