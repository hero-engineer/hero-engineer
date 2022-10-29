import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'
import CoolDaddy from './CoolDaddy'

function MultipleDivs(props: any) {
  console.log('__rendering MultipleDivs')

  return (
    <>
      <>
        <CoolDiv key="AQ66KFAsn" />
        <>
          <CoolDiv key="z9gvYbD7EC" />
          <CoolDiv key="o0_Bh23Rwk" />
        </>
      </>
      <Div
        key="UNA7ZLVtlU"
        data-ecu="4i8RUnflxL:0"
      >
        <Div
          key="YlGUNkTn4M"
          data-ecu="4i8RUnflxL:0_0"
        >
          Dear component
        </Div>
        
        <Div
          key="pdYaKURhar"
          data-ecu="4i8RUnflxL:0_1"
        >
          Hello
        </Div>
        <CoolDaddy key="Elw_TU-ML7">
          Darling
          
        </CoolDaddy>
      </Div>
    </>
  )
}
export default MultipleDivs
