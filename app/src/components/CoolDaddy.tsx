import { Foo } from '@global-types'
import { PropsWithChildren } from 'react'
import { Div } from 'ecu-client'

/* --
  * TYPES START
-- */


type CoolDaddyPropsType = PropsWithChildren<{
  placeholder: Foo;
}>;


/* --
  * TYPES END
-- */

function CoolDaddy({
  children,
}: CoolDaddyPropsType) {
  return (
    <Div data-ecu="4e3a9seorU:0">
      <Div data-ecu="4e3a9seorU:0_0">
        I'm a cool daddy look at me
      </Div>
      {children}
    </Div>
  )
}

export default CoolDaddy
