import fs from 'node:fs'
import path from 'node:path'

import { ColorType, FileNodeType, HistoryMutationReturnType } from '../../types.js'
import { appPath, colorsEndComment, colorsStartComment, ecuColorsFileName, indexCssFileRelativePath } from '../../configuration.js'

import { findNode } from '../../graph/index.js'

import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import getEcuLocation from '../../helpers/getEcuLocation.js'

type UpdateColorsMutationArgsType = {
  colorsJson: string
}

async function updateColorsMutation(_: any, { colorsJson }: UpdateColorsMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  try {
    const colors = JSON.parse(colorsJson) as ColorType[]
    const ecuLocation = getEcuLocation()
    const colorsFileLocation = path.join(ecuLocation, ecuColorsFileName)

    fs.writeFileSync(colorsFileLocation, JSON.stringify(colors, null, 2))

    const variables = colors.map(color => `  ${color.variableName}: ${color.value}; /* ${color.name} */`).join('\n')
    const indexCssFileLocation = path.join(appPath, indexCssFileRelativePath)
    const indexCssNode = findNode<FileNodeType>(n => n.payload.relativePath === indexCssFileRelativePath)

    if (!indexCssNode) {
      throw new Error('index.css file not found')
    }

    const code = insertBetweenComments(indexCssNode.payload.code, colorsStartComment, colorsEndComment, variables)

    fs.writeFileSync(indexCssFileLocation, code)
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
