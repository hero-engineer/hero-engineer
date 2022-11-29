import { CssAttributeType, FileNodeType } from '../../types.js'

import traverseCss from './traverseCss.js'

async function updateCssSelector(fileNode: FileNodeType, selector: string, attributes: CssAttributeType[], breakpointMaxValue: number | null) {
  await traverseCss(fileNode, selector, breakpointMaxValue, (_cssClass, rule) => {
    // let foundMediaMatchingBreakpoint = mediaNodes.find(mediaNode => mediaNode.)

    rule.nodes.length = 0
    rule.raws.after = '\n' // Styling

    attributes.forEach(attribute => {
      rule.append({
        prop: attribute.name,
        value: attribute.value.toString(),
      })
    })
  }, true)
}

export default updateCssSelector
