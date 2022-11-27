import { CssAttributeType, FileNodeType } from '../../types.js'

import traverseCss from './traverseCss.js'

async function updateCssSelector(fileNode: FileNodeType, selector: string, attributes: CssAttributeType[]) {
  await traverseCss(fileNode, selector, (_cssClass, rule) => {
    rule.nodes.length = 0

    attributes.forEach(attribute => {
      rule.append({
        prop: attribute.name,
        value: attribute.value.toString(),
      })
    })
  }, true)
}

export default updateCssSelector
