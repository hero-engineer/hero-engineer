import postcss from 'postcss'
import posscssNested from 'postcss-nested'

import { CssAttributeType, CssClassType, FileNodeType } from '../../types.js'

async function traverseCss(fileNode: FileNodeType, targetSelector?: string, onSuccess?: (cssClass: CssClassType) => void) {
  const { root } = await postcss([posscssNested]).process(fileNode.payload.code, { from: fileNode.payload.path })

  const classes: CssClassType[] = []

  root.walkRules(rule => {
    const attributes: CssAttributeType[] = []

    rule.nodes.forEach((node: any) => {
      attributes.push({
        name: node.prop,
        value: node.value,
      })
    })

    const cssClass: CssClassType = {
      selector: rule.selector,
      declaration: rule.source?.input.css ?? '',
      attributes,
    }

    classes.push(cssClass)

    if (cssClass.selector === targetSelector) onSuccess?.(cssClass)
  })

  return classes
}

export default traverseCss
