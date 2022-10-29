import { FunctionNodeType } from '../../types'

import { getNodeByAddress } from '../../graph'

type GetComponentArgs = {
  id: string
}

function getComponent(_: any, { id }: GetComponentArgs) {
  const node = getNodeByAddress<FunctionNodeType>(id)

  return node || null
}

export default getComponent
