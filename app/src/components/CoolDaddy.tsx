/* --
  * IMPORTS START
-- */
import { Foo } from '@global-types'
import { PropsWithChildren } from 'react'
import { Div } from 'ecu-client'
/* --
  * IMPORTS END
-- */
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
    <Div data-ecu="ooDByplP6O:0">
      <Div data-ecu="ooDByplP6O:0_0">
        I'm a cool daddy look at me
      </Div>
      {children}
    </Div>
  )
}

export default CoolDaddy
