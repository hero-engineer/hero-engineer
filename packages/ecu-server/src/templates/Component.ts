export default (name: string) => `/* --
* IMPORTS START
-- */
import { Div } from 'ecu'

/* --
* IMPORTS END
-- */
/* --
* TYPES START
-- */
type ${name}PropsType = Record<string, never>;

/* --
* TYPES END
-- */

function ${name}(props: ${name}PropsType) {
return (
  <Div>
    Edit me I'm famous!
  </Div>
)
}

export default ${name}
`
