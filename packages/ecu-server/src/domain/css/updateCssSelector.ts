import { BreakpointType, CssAttributeType, FileNodeType } from '../../types.js'

import traverseCss from './traverseCss.js'

async function updateCssSelector(fileNode: FileNodeType, selector: string, attributes: CssAttributeType[], breakpoint: BreakpointType) {
  await traverseCss(fileNode, selector, breakpoint, (_cssClass, rule) => {
    rule.nodes.length = 0

    attributes.forEach(attribute => {
      rule.append({
        prop: attribute.name,
        value: attribute.value.toString(),
      })

      // Styling: prepend spaces to the declaration
      rule.nodes[rule.nodes.length - 1].raws.before = breakpoint.media ? '\n    ' : '\n  '

      if (attribute.comment) {
        rule.append({
          text: attribute.comment,
        })

        // Styling: put the comment on the same line as the declaration
        rule.nodes[rule.nodes.length - 1].raws.before = ' '
      }
    })

  }, true)
}

export default updateCssSelector
