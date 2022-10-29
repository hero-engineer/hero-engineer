import { FunctionNodeType } from '../../types'

import graph from '../../graph'
import { getNodeByAddress } from '../../graph/helpers'

type GetComponentArgs = {
  id: string
}

function getComponent(_: any, { id }: GetComponentArgs) {
  const node = getNodeByAddress<FunctionNodeType>(graph, id)

  return node || null
}

export default getComponent
