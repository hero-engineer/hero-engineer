import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <>
          <CoolDiv key="dYkcxNdgLTI" />
          <CoolDiv key="HsB-DtqHda4" />
        </>
        <>
          <CoolDiv key="sJe0qigyHFD" />
          <CoolDiv key="R5R-uov96Qd" />
        </>
      </>
      <Div
        key="r8dEw5-A-N1"
        data-ecu="i8B83YRTDH:0"
      >
        <Div
          key="wvjKckeE9KN"
          data-ecu="i8B83YRTDH:0_0"
        >
          Dear component
        </Div>
        <Div
          key="k4-PkKxFG1I"
          data-ecu="i8B83YRTDH:0_1"
        >
          Hello
        </Div>
        <CoolDaddy key="oBS_lMMz1xl">
          Darling

        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
