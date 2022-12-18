import { Comment, Declaration } from 'postcss'

import { CssVariableType } from '~types'

import postCss, { cssReady, getIndexCss } from '~processors/css'
import traverse from '~processors/css/traverse'

async function getVariables() {
  await cssReady.promise

  const { filePath, code } = getIndexCss()
  const { root } = postCss.process(code, { from: filePath })

  const variables: CssVariableType[] = []

  traverse(root, rule => {
    if (rule.selector !== ':root') return

    rule.nodes.forEach((node, i) => {
      if (node.type !== 'decl') return

      const declaration = node as Declaration

      if (!declaration.variable) return

      variables.push({
        id: declaration.prop,
        type: declaration.prop.startsWith('--color') || declaration.prop.startsWith('$color')
          ? 'color'
          : declaration.prop.startsWith('--spacing') || declaration.prop.startsWith('$spacing')
            ? 'spacing'
            : 'other',
        name: rule.nodes[i + 1]?.type === 'comment' ? (rule.nodes[i + 1] as Comment).text : declaration.prop,
        value: declaration.value,
      })
    })
  })

  return variables
}

export default getVariables
