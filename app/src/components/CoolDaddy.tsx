import { PropsWithChildren } from 'react'
import { Div } from 'ecu-client'

/* --
  * TYPES START
-- */

type CoolDaddyPropsType = PropsWithChildren<Record<string, never>>;

/* --
  * TYPES END
-- */

function CoolDaddy({
  children,
}: CoolDaddyPropsType) {
  return (
    <Div data-ecu="w2WLETgnnY:0">
      <Div data-ecu="w2WLETgnnY:0_0">
        I'm a cool daddy look at me
      </Div>
      {children}
    </Div>
  )
}

export default CoolDaddy
