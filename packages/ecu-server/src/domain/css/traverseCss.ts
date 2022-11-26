import postcss from 'postcss'
import posscssNested from 'postcss-nested'

import { CssAttributeType, CssClassType, FileNodeType } from '../../types.js'

async function traverseCss(fileNode: FileNodeType) {
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

    classes.push({
      selector: rule.selector,
      declaration: rule.source?.input.css ?? '',
      attributes,
    })
  })

  console.log(JSON.stringify(classes, null, 2))

  return classes
}

export default traverseCss
