export default (name: string) => `/* --
* IMPORTS START
-- */
import { Text } from 'hero-engineer'

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
/* --
  * EMOJI START
-- */
/* --
  * EMOJI END
-- */
/* --
  * DESCRIPTION START
-- */
/* --
  * DESCRIPTION END
-- */

function ${name}(props: ${name}PropsType) {
return (
  <Text>
    Edit me I'm famous!
  </Text>
)
}

export default ${name}
`
