import fs from 'node:fs'

import postcss, { Rule } from 'postcss'
import posscssNested from 'postcss-nested'

import { CssAttributeType, CssClassType, FileNodeType } from '../../types.js'

import areSelectorsEqual from './utils/areSelectorsEqual.js'

async function traverseCss(fileNode: FileNodeType, targetSelector?: string, onSuccess?: (cssClass: CssClassType, rule: Rule) => void, regenerate?: boolean) {
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

    if (targetSelector && areSelectorsEqual(cssClass.selector, targetSelector)) onSuccess?.(cssClass, rule)
  })

  if (regenerate) {
    const code = root.toResult().css

    fs.writeFileSync(fileNode.payload.path, code, 'utf8')
  }

  return classes
}

export default traverseCss
