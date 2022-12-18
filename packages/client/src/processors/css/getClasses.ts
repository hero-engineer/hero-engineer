import { ChildNode } from 'postcss'

import { CssAttributeType, CssClassType } from '~types'

import postCss, { cssReady, getIndexCss } from '~processors/css'
import traverse from '~processors/css/traverse'

import convertCssAttributeCssNameToJs from '~utils/convertCssAttributeCssNameToJs'

async function getClasses() {
  await cssReady.promise

  const { filePath, code } = getIndexCss()

  const classes: CssClassType[] = []

  const { root } = postCss.process(code, { from: filePath })

  traverse(root, (rule, media) => {
    if (!rule.selector.startsWith('.')) return

    const attributes: CssAttributeType[] = []

    rule.nodes.forEach((node: ChildNode) => {
      if (node.type === 'decl') {
        attributes.push({
          cssName: node.prop,
          jsName: convertCssAttributeCssNameToJs(node.prop),
          value: node.value,
          isImportant: node.important,
          comment: node.raws.value?.raw ?? '',
        })
      }
    })

    const cssClass: CssClassType = {
      id: rule.selector + media,
      selector: rule.selector,
      declaration: rule.toString(),
      attributes,
      media,
    }

    classes.push(cssClass)
  })

  return classes
}

export default getClasses
