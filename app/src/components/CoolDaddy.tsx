/* --
  * IMPORTS START
-- */
import { Baar, Bar, Baz, Foo, Fooo } from '@global-types'
import { PropsWithChildren } from 'react'
import { Div } from 'ecu-client'

import CoolDiv from './CoolDiv'

/* --
  * IMPORTS END
-- */
/* --
  * TYPES START
-- */
type CoolDaddyPropsType = PropsWithChildren<{
  placeholder?: Baar;
}>;
/* --
  * TYPES END
-- */

function CoolDaddy({
  children,
}: CoolDaddyPropsType) {
  return (
    <>
      <Div data-ecu="vUElJdTQrW:0">
        I'm a cool daddy look at me
      </Div>
      {children}
    </>
  )
}

export default CoolDaddy
