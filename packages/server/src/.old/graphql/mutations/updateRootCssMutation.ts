import fs from 'node:fs'

import { HistoryMutationReturnType } from '../../types.js'
import { rootCssEndComment, rootCssStartComment } from '../../configuration.js'

import getIndexCssNode from '../../domain/css/getIndexCssNode.js'
import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

type UpdateRootCssMutationArgsType = {
  rootCss: string
}

async function updateRootCssMutation(_: any, { rootCss }: UpdateRootCssMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  try {
    const indexCssNode = getIndexCssNode()
    const code = insertBetweenComments(indexCssNode.payload.code, rootCssStartComment, rootCssEndComment, rootCss)

    fs.writeFileSync(indexCssNode.payload.path, code)
  }
  catch (error) {
    console.error(error)

    throw new Error('Error updating root CSS')
  }

  return {
    returnValue: true,
    description: 'Update root CSS',
  }
}

export default composeHistoryMutation(updateRootCssMutation)
