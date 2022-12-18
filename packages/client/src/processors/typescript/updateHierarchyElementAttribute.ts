import { JsxAttribute, JsxElement, JsxOpeningElement, JsxSelfClosingElement, SyntaxKind } from 'ts-morph'

import { HierarchyType } from '~types'

import project, { projectReady } from '~processors/typescript'
import findNodeByStart from '~processors/typescript/findNodeByStart'

async function updateHierarchyElementAttribute(hierarchy: HierarchyType, attributeName: string, attributeValue: string, shouldLog = false) {
  await projectReady.promise

  const consoleLog = shouldLog ? console.log : () => {}
  const consoleGroupEnd = shouldLog ? console.groupEnd : () => {}
  const consoleGroupCollapsed = shouldLog ? console.groupCollapsed : () => {}

  consoleGroupCollapsed('UPDATE_HIERARCHY_ELEMENT_ATTRIBUTE_START')

  const start = Date.now()
  const sourceFile = project.getSourceFile(hierarchy.onFilePath)

  if (!sourceFile) {
    consoleLog('SOURCE FILE NOT FOUND')

    return null
  }

  const node = findNodeByStart(sourceFile, hierarchy.start)

  if (!node) {
    consoleLog('NODE NOT FOUND')

    return null
  }

  const nodeKind = node.getKind()

  if (!(nodeKind === SyntaxKind.JsxElement || nodeKind === SyntaxKind.JsxOpeningElement || nodeKind === SyntaxKind.JsxSelfClosingElement)) {
    consoleLog('NODE KIND IS', node.getKindName())

    return null
  }

  let jsxElement = node as JsxElement | JsxOpeningElement | JsxSelfClosingElement

  if (nodeKind === SyntaxKind.JsxElement) jsxElement = (jsxElement as JsxElement).getOpeningElement()

  jsxElement = jsxElement as JsxOpeningElement | JsxSelfClosingElement

  jsxElement.getAttributes().forEach(attribute => {
    if (attribute.getKind() === SyntaxKind.JsxAttribute && (attribute as JsxAttribute).getName() === attributeName) {
      attribute.remove()
    }
  })

  if (attributeValue) {
    jsxElement.addAttribute({
      name: attributeName,
      initializer: `"${attributeValue}"`,
    })
  }

  const code = sourceFile.getFullText()

  consoleGroupEnd()
  consoleLog('UPDATE_HIERARCHY_ELEMENT_ATTRIBUTE_END', Date.now() - start)

  return code
}

export default updateHierarchyElementAttribute
