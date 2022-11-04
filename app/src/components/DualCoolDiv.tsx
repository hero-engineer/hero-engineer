import { Div } from 'ecu-client'

function DualCoolDiv(props: any) {
  console.log('__rendering DualCoolDiv')

  return (
    <>
      <Div data-ecu="a4zZemWiLN:0">
        Edit me I'm famous 1
      </Div>
      <Div data-ecu="a4zZemWiLN:1">
        Edit me I'm famous 2
      </Div>
    </>
  )
}
export default DualCoolDiv
