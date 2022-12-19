import { commitPrefix } from '../../configuration.js'

function possiblyRemoveCommitPrefix(message: string) {
  if (message.startsWith(commitPrefix)) {
    return message.slice(commitPrefix.length)
  }

  return message
}

export default possiblyRemoveCommitPrefix
