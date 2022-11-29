import { BreakpointType, CssAttributeType, FileNodeType } from '../../types.js'

import traverseCss from './traverseCss.js'

async function updateCssSelector(fileNode: FileNodeType, selector: string, attributes: CssAttributeType[], breakpoint: BreakpointType) {
  await traverseCss(fileNode, selector, breakpoint, (_cssClass, rule) => {
    rule.nodes.length = 0
    // rule.raws.after = '\n'  // Styling

    attributes.forEach(attribute => {
      rule.append({
        prop: attribute.name,
        value: attribute.value.toString(),
      })
    })
  }, true)
}

export default updateCssSelector
