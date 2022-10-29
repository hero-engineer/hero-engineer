import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <>
          <CoolDiv key="UWh03w-Dp3W" />
          <CoolDiv key="-3TmLj5KGkG" />
        </>
        <>
          <CoolDiv key="4zLqQhf2VaR" />
          <CoolDiv key="1eaGZicrCcA" />
        </>
      </>
      <Div
        data-ecu-hierarchy="RqcE9GFK_5:0"
        key="pMEUvUgZBu3"
        data-ecu="ejVVI24Nn5:0"
      >
        <Div
          data-ecu-hierarchy="RqcE9GFK_5:0_0"
          key="_TbivKCGiVk"
          data-ecu="ejVVI24Nn5:0_0"
        >
          Dear component
        </Div>
        <Div
          data-ecu-hierarchy="RqcE9GFK_5:0_1"
          key="Jtr6nsDFWTb"
          data-ecu="ejVVI24Nn5:0_1"
        >
          Hello
        </Div>
        <CoolDaddy key="3eZ9ZvnvH24">
          Darling

        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
