import { FunctionNodeType } from '../../types'

import { getNodeByAddress } from '../../graph'

type ComponentQueryArgs = {
  sourceComponentAddress: string
}

function componentQuery(_: any, { sourceComponentAddress }: ComponentQueryArgs) {
  const node = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  return node || null
}

export default componentQuery
