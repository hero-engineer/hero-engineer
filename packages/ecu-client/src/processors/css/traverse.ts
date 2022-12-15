import { AtRule, ChildNode, Document, Root, Rule } from 'postcss'

import { BreakpointType, CssAttributeType, CssClassType } from '~types'

import areSelectorsEqual from '~utils/areSelectorsEqual'
import convertCssAttributeCssNameToJs from '~utils/convertCssAttributeCssNameToJs'

function traverse(root: Root, targetSelector?: string, breakpoint?: BreakpointType, onSuccess?: (cssClass: CssClassType, rule: Rule, root: Root | Document) => void,) {
  const classes: CssClassType[] = []

  root.walkRules(rule => {
    if (!rule.selector.startsWith('.')) return

    const attributes: CssAttributeType[] = []
    const media = rule.parent?.type === 'atrule' ? (rule.parent as AtRule).params : ''

    rule.nodes.forEach((node: ChildNode) => {
      if (node.type === 'decl') {
        attributes.push({
          cssName: node.prop,
          jsName: convertCssAttributeCssNameToJs(node.prop),
          value: node.value,
          isImportant: node.important,
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

    if (targetSelector && areSelectorsEqual(cssClass.selector, targetSelector) && media === breakpoint?.media && typeof onSuccess === 'function') {
      onSuccess(cssClass, rule, root)
    }
  })

  return classes
}

export default traverse
