import { descriptionEndComment, descriptionStartComment, emojiEndComment, emojiStartComment } from '../../configuration.js'
import { FileNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import insertBetweenComments from '../../domain/comments/insertBetweenComments.js'
import wrapInNormalizedComments from '../../domain/comments/wrapInNormalizedComment.js'
import regenerate from '../../domain/regenerate.js'

type UpdateFileDescriptionMutationArgs = {
  sourceFileAddress: string
  description: string
  emoji: string
}

async function updateFileDescriptionMutation(_: any, { sourceFileAddress, description, emoji }: UpdateFileDescriptionMutationArgs): Promise<HistoryMutationReturnType<boolean>> {
  console.log('__updateFileDescriptionMutation__')

  const fileNode = getNodeByAddress<FileNodeType>(sourceFileAddress)

  if (!fileNode) {
    throw new Error(`File ${sourceFileAddress} not found`)
  }

  let { code } = fileNode.payload

  code = insertBetweenComments(code, descriptionStartComment, descriptionEndComment, wrapInNormalizedComments(description))
  code = insertBetweenComments(code, emojiStartComment, emojiEndComment, wrapInNormalizedComments(emoji))

  if (!code) {
    throw new Error(`Imports start or end comment not found for component ${sourceFileAddress}`)
  }

  await regenerate(fileNode, code)

  return {
    returnValue: true,
    description: `Update description and emoji for file ${fileNode.payload.name}`,
  }
}

export default composeHistoryMutation(updateFileDescriptionMutation)
