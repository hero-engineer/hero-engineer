import { Comment, Declaration } from 'postcss'

import { CssVariableType, CssVariableTypeType } from '~types'

import postCss, { cssReady, getIndexCss, setIndexCss } from '~processors/css'
import traverse from '~processors/css/traverse'
import getVariables from '~processors/css/getVariables'

async function setVariables(variables: CssVariableType[], type: CssVariableTypeType) {
  await cssReady.promise

  const { filePath, code } = getIndexCss()
  const { root } = postCss.process(code, { from: filePath })

  const existingVariables = await getVariables()
  const existingVariablesOfType = existingVariables.filter(v => v.type === type)

  traverse(root, rule => {
    if (rule.selector !== ':root') return

    rule.nodes.forEach((node, i) => {
      if (node.type !== 'decl') return

      const declaration = node as Declaration

      if (!declaration.variable) return

      const existingVariable = existingVariablesOfType.find(v => v.id === declaration.prop)

      if (!existingVariable) return

      rule.removeChild(node)

      if (rule.nodes[i]?.type !== 'comment') return

      rule.removeChild(rule.nodes[i])
    })

    variables.forEach(variable => {
      rule.append(new Declaration({
        prop: variable.id,
        value: variable.value,
        raws: {
          before: '\n  ',
          after: '',
        },
      }))

      rule.append(new Comment({
        text: variable.name,
        raws: {
          before: ' ',
        },
      }))
    })
  })

  const nextCode = root.toString()

  setIndexCss(nextCode)

  return {
    filePath,
    code: nextCode,
  }
}

export default setVariables
