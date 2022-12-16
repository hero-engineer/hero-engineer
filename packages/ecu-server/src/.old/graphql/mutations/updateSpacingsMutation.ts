import fs from 'node:fs'

import { HistoryMutationReturnType, SpacingType } from '../../types.js'
import { spacingsEndComment, spacingsStartComment } from '../../configuration.js'

import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'
import getIndexCssNode from '../../domain/css/getIndexCssNode.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

type UpdateColorsMutationArgsType = {
  spacingsJson: string
}

async function updateSpacingsMutation(_: any, { spacingsJson }: UpdateColorsMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  try {
    const spacings = JSON.parse(spacingsJson) as SpacingType[]
    const variables = spacings.map(spacing => `  ${spacing.variableName}: ${spacing.value}; /* ${spacing.name} */`).join('\n')
    const indexCssNode = getIndexCssNode()
    const code = insertBetweenComments(indexCssNode.payload.code, spacingsStartComment, spacingsEndComment, variables)

    fs.writeFileSync(indexCssNode.payload.path, code)
  }
  catch (error) {
    console.error(error)

    throw new Error('Error updating spacings')
  }

  return {
    returnValue: true,
    description: 'Update spacings',
  }
}

export default composeHistoryMutation(updateSpacingsMutation)
