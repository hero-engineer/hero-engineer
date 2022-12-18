import { JSXElement } from '@babel/types'
import { NodePath } from '@babel/traverse'

import { ecuDisplayNameCommentPrefix } from '../../configuration.js'

import traverse from '../traverse.js'

function traverseDisplayName(x: NodePath<JSXElement>) {
  let displayName = ''

  traverse(x.node, {
    enter(x) {
      const comment = (x.node.trailingComments || []).find(c => c.value.trim().startsWith(ecuDisplayNameCommentPrefix))

      if (comment) {
        displayName = comment.value.trim().slice(ecuDisplayNameCommentPrefix.length + 1)

        x.stop()
      }
    },
    JSXElement(x) {
      x.stop()
    },
  }, x.scope, x.parentPath)

  return displayName
}

export default traverseDisplayName
