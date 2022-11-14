/* --
  * IMPORTS START
-- */
import { Baar, Bar, Baz, Foo, Fooo } from '@global-types'
import { PropsWithChildren } from 'react'
import { Div } from 'ecu-client'

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
      <Div data-ecu="5h2Dyhj5Iv:0">
        I'm a cool daddy look at me
      </Div>
      {children}
    </>
  )
}

export default CoolDaddy
