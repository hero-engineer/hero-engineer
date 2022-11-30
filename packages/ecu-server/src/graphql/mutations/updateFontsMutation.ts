import fs from 'node:fs'
import path from 'node:path'

import { FontType, HistoryMutationReturnType } from '../../types.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'
import getEcuLocation from '../../helpers/getEcuLocation.js'

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
