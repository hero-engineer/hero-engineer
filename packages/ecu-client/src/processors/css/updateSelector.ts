import { BreakpointType, CssAttributeType } from '~types'

import postCss, { cssReady, getIndexCss, setIndexCss } from '~processors/css'
import traverse from '~processors/css/traverse'

async function updateSelector(selector: string, attributes: CssAttributeType[], breakpoint: BreakpointType) {
  await cssReady.promise

  const { filePath, code } = getIndexCss()
  const { root } = postCss.process(code, { from: filePath })

  traverse(root, (rule, media) => {
    if (!(rule.selector === selector && media === breakpoint.media)) return

    rule.nodes.length = 0

    attributes.forEach(attribute => {
      rule.append({
        prop: attribute.cssName,
        value: attribute.value.toString(),
        important: attribute.isImportant,
      })

      // Styling: prepend spaces to the declaration
      rule.nodes[rule.nodes.length - 1].raws.before = breakpoint.media ? '\n    ' : '\n  '

      if (!attribute.comment) return

      rule.append({ text: attribute.comment })
    })
  })

  const nextCode = root.toString()

  setIndexCss(nextCode)

  return {
    filePath,
    code: nextCode,
  }
}

export default updateSelector
