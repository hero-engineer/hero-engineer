import fs from 'node:fs'

import { FontType, HistoryMutationReturnType } from '../../types.js'
import { fontsEndComment, fontsStartComment } from '../../configuration.js'

import getIndexCssNode from '../../domain/css/getIndexCssNode.js'
import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

type UpdateFontsMutationArgsType = {
  fontsJson: string
}

async function updateFontsMutation(_: any, { fontsJson }: UpdateFontsMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  try {
    const fonts = JSON.parse(fontsJson) as FontType[]
    const imports = fonts.map(font => `@import url('${font.url}'); /* ${font.id} ~~~ ${font.name} ~~~ ${font.isVariable ? 'variable' : font.weights.join(',')} */`).join('\n')
    const indexCssNode = getIndexCssNode()
    const code = insertBetweenComments(indexCssNode.payload.code, fontsStartComment, fontsEndComment, imports)

    fs.writeFileSync(indexCssNode.payload.path, code)
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
