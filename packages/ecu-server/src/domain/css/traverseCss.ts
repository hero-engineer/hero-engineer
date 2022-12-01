import fs from 'node:fs'

import postcss, { AtRule, Document, Root, Rule } from 'postcss'
import posscssNested from 'postcss-nested'

import { BreakpointType, CssAttributeType, CssClassType, FileNodeType } from '../../types.js'

import areSelectorsEqual from './utils/areSelectorsEqual.js'

async function traverseCss(fileNode: FileNodeType, targetSelector?: string, breakpoint?: BreakpointType, onSuccess?: (cssClass: CssClassType, rule: Rule, root: Root | Document) => void, regenerate?: boolean) {
  const { root } = await postcss([posscssNested]).process(fileNode.payload.code, { from: fileNode.payload.path })

  const classes: CssClassType[] = []

  root.walkRules(rule => {
    if (!rule.selector.startsWith('.')) return

    const attributes: CssAttributeType[] = []
    const media = rule.parent?.type === 'atrule' ? (rule.parent as AtRule).params : ''

    rule.nodes.forEach((node: any) => {
      attributes.push({
        name: node.prop,
        value: node.value,
      })
    })

    const cssClass: CssClassType = {
      id: rule.selector + media,
      selector: rule.selector,
      declaration: rule.toString(),
      attributes,
      media,
    }

    classes.push(cssClass)

    if (targetSelector && areSelectorsEqual(cssClass.selector, targetSelector) && media === breakpoint?.media && typeof onSuccess === 'function') {
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
