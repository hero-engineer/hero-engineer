import fs from 'node:fs'

import { ColorType, HistoryMutationReturnType } from '../../types.js'
import { colorsEndComment, colorsStartComment } from '../../configuration.js'

import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'
import getIndexCssNode from '../../domain/css/getIndexCssNode.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

type UpdateColorsMutationArgsType = {
  colorsJson: string
}

async function updateColorsMutation(_: any, { colorsJson }: UpdateColorsMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  try {
    const colors = JSON.parse(colorsJson) as ColorType[]
    const variables = colors.map(color => `  ${color.variableName}: ${color.value}; /* ${color.name} */`).join('\n')
    const indexCssNode = getIndexCssNode()
    const code = insertBetweenComments(indexCssNode.payload.code, colorsStartComment, colorsEndComment, variables)

    fs.writeFileSync(indexCssNode.payload.path, code)
  }
  catch (error) {
    console.error(error)

    throw new Error('Error updating colors')
  }

  return {
    returnValue: true,
    description: 'Update colors',
  }
}

export default composeHistoryMutation(updateColorsMutation)
