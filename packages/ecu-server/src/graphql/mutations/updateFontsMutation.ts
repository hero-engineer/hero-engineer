import fs from 'node:fs'
import path from 'node:path'

import { FileNodeType, FontType, HistoryMutationReturnType } from '../../types.js'
import { appPath, fontsEndComment, fontsStartComment, indexCssFileRelativePath } from '../../configuration.js'

import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'
import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import getEcuLocation from '../../helpers/getEcuLocation.js'
import { findNode } from '../../graph/index.js'

type UpdateFontsMutationArgsType = {
  fontsJson: string
}

async function updateFontsMutation(_: any, { fontsJson }: UpdateFontsMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  console.log('_updateFontsMutation__')

  try {
    const fonts = JSON.parse(fontsJson) as FontType[]
    const ecuLocation = getEcuLocation()
    const fontsFileLocation = path.join(ecuLocation, 'fonts.json')

    fs.writeFileSync(fontsFileLocation, JSON.stringify(fonts, null, 2))

    const imports = fonts.map(font => `@import url('${font.url}');`).join('\n')
    const indexCssFileLocation = path.join(appPath, indexCssFileRelativePath)
    const indexCssNode = findNode<FileNodeType>(n => n.payload.relativePath === indexCssFileRelativePath)

    if (!indexCssNode) {
      throw new Error('index.css file not found')
    }

    const code = insertBetweenComments(indexCssNode.payload.code, fontsStartComment, fontsEndComment, imports)

    fs.writeFileSync(indexCssFileLocation, code)
  }
  catch (error) {
    console.error(error)

    throw new Error('Error updating fonts')
  }

  return {
    returnValue: true,
    description: 'Update fonts',
  }
}

export default composeHistoryMutation(updateFontsMutation)
