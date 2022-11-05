import { FunctionNodeType } from '../../types'

import { getNodeByAddress } from '../../graph'

type ComponentQueryArgs = {
  id: string
}

function componentQuery(_: any, { id }: ComponentQueryArgs) {
  const node = getNodeByAddress<FunctionNodeType>(id)

  return node || null
}

export default componentQuery
