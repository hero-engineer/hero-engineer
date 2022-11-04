import { Div } from 'ecu-client'

function CoolDaddy({
  children,
}: any) {
  console.log('__rendering CoolDaddy')

  return (
    <Div data-ecu="QjCGxJR28A:0">
      <Div data-ecu="QjCGxJR28A:0_0">
        I'm a cool daddy look at me
      </Div>
      {children}
    </Div>
  )
}
export default CoolDaddy
