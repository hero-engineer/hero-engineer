import { HistoryMutationReturnType } from '../../types.js'

import updateFavicon from '../../domain/html/updateFavicon.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

type UpdateFaviconMutationArgsType = {
  url: string
}

async function updateFaviconMutation(_: any, { url }: UpdateFaviconMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  updateFavicon(url)

  return {
    returnValue: true,
    description: 'Update favicon',
  }
}

export default composeHistoryMutation(updateFaviconMutation)
