import fs from 'node:fs'

import postcss, { AtRule, Document, Root, Rule } from 'postcss'
import posscssNested from 'postcss-nested'

import { CssAttributeType, CssClassType, FileNodeType } from '../../types.js'

import areSelectorsEqual from './utils/areSelectorsEqual.js'

// eslint-disable-next-line default-param-last
async function traverseCss(fileNode: FileNodeType, targetSelector?: string, breakpointMaxValue: number | null = null, onSuccess?: (cssClass: CssClassType, rule: Rule, root: Root | Document) => void, regenerate?: boolean) {
  const { root } = await postcss([posscssNested]).process(fileNode.payload.code, { from: fileNode.payload.path })

  const classes: CssClassType[] = []

  root.walkRules(rule => {
    const attributes: CssAttributeType[] = []

    let parentBreakpointMaxValue: number | null = null

    if (rule.parent?.type === 'atrule' && (rule.parent as AtRule).params.startsWith('screen and (max-width: ')) {
      const rawBreakpointMaxValue = (rule.parent as AtRule).params.slice('screen and (max-width: '.length, -'px)'.length)
      const numericBreakpointMaxValue = parseInt(rawBreakpointMaxValue)

      if (numericBreakpointMaxValue === numericBreakpointMaxValue) parentBreakpointMaxValue = numericBreakpointMaxValue
    }

    rule.nodes.forEach((node: any) => {
      attributes.push({
        name: node.prop,
        value: node.value,
      })
    })

    const cssClass: CssClassType = {
      selector: rule.selector,
      declaration: rule.toString(),
      attributes,
      breakpointMaxValue: parentBreakpointMaxValue,
    }

    classes.push(cssClass)

    if (targetSelector && areSelectorsEqual(cssClass.selector, targetSelector) && parentBreakpointMaxValue === breakpointMaxValue && typeof onSuccess === 'function') {
      onSuccess(cssClass, rule, root)
    }
  })

  if (regenerate) {
    const code = root.toResult().css

    fs.writeFileSync(fileNode.payload.path, code, 'utf8')
  }

  return classes
}

export default traverseCss
