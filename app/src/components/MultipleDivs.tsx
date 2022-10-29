import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <>
          <CoolDiv key="j4tZjA3BnIK" />
          <CoolDiv key="T9M9E-l5XtT" />
        </>
        <>
          <CoolDiv key="oqCUf_ylxiR" />
          <CoolDiv key="nRuOl8JwaL5" />
        </>
      </>
      <Div
        key="BJaBTWIXfhq"
        data-ecu="yqCZym6AcQ:0"
      >
        <Div
          key="FpdEYjlgAUR"
          data-ecu="yqCZym6AcQ:0_0"
        >
          Dear component
        </Div>
        <Div
          key="mTkLjXsXnkv"
          data-ecu="yqCZym6AcQ:0_1"
        >
          Hello
        </Div>
        <CoolDaddy key="dAQNHG1yFl5">
          Darling

        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
