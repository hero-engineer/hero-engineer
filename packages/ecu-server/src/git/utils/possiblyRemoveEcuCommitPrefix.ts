import { ecuCommitPrefix } from '../../configuration.js'

function possiblyRemoveEcuCommitPrefix(message: string) {
  if (message.startsWith(ecuCommitPrefix)) {
    return message.slice(ecuCommitPrefix.length)
  }

  return message
}

export default possiblyRemoveEcuCommitPrefix
