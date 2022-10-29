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
          <CoolDiv />
        </>
      </>
      <Div data-ecu="7Uu1Bmr60c:0">
        <Div data-ecu="7Uu1Bmr60c:0_0">
          Dear component
        </Div>
        <Div data-ecu="7Uu1Bmr60c:0_1">
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
