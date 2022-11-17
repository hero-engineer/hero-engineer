export default (name: string) => `/* --
* IMPORTS START
-- */
import { Text } from 'ecu'

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
  <Text>
    Edit me I'm famous!
  </Text>
)
}

export default ${name}
`
