import { NodePath } from '@babel/traverse'
import { JSXAttribute, JSXElement, JSXIdentifier, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'

import { indexCssFileRelativePath } from '../../configuration.js'
import { BreakpointType, FileNodeType, FunctionNodeType, HistoryMutationReturnType } from '../../types.js'

import { getNodeByAddress, getNodesByRole } from '../../graph/index.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import processImpactedFileNodes from '../../domain/processImpactedFileNodes.js'
import traverseComponent from '../../domain/components/traverseComponent.js'
import appendCssSelector from '../../domain/css/appendCssSelector.js'
import readBreakpoints from '../../domain/css/readBreakpoints.js'
import applyComponentDelta from '../../domain/utils/applyComponentDelta.js'

type CreateCssClassMutationArgsType = {
  sourceComponentAddress: string
  targetHierarchyId: string
  componentDelta: number
  classNames: string[]
}

function sortBreakpoints(a: BreakpointType, b: BreakpointType) {
  if (!a.media && b.media) return -1
  if (a.media && !b.media) return 1

  return b.base - a.base
}

async function createCssClassMutation(_: any, { sourceComponentAddress, targetHierarchyId, componentDelta, classNames }: CreateCssClassMutationArgsType): Promise<HistoryMutationReturnType<boolean>> {
  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    throw new Error(`Component with id ${sourceComponentAddress} not found`)
  }

  if (componentDelta > 0) {
    throw new Error('Positive componentDelta not supported')
  }

  const indexCssNode = getNodesByRole<FileNodeType>('File').find(node => node.payload.relativePath === indexCssFileRelativePath)

  if (!indexCssNode) {
    throw new Error('index.css file not found')
  }

  let componentName = ''
  const breakpoints = readBreakpoints()

  function onSuccess(paths: NodePath<JSXElement>[]) {
    const finalPath = applyComponentDelta(paths, componentDelta)

    componentName = (finalPath.node.openingElement.name as JSXIdentifier).name

    const foundClassNameAttribute = finalPath.node.openingElement.attributes.find(a => a.type === 'JSXAttribute' && a.name.name === 'className') as JSXAttribute

    if (foundClassNameAttribute) {
      if (!classNames.length) {
        finalPath.node.openingElement.attributes.splice(finalPath.node.openingElement.attributes.indexOf(foundClassNameAttribute), 1)
      }
      else if (foundClassNameAttribute.value?.type === 'StringLiteral') {
        foundClassNameAttribute.value.value = classNames.join(' ')
      }
      else {
        throw new Error('Unsupported non-string className attribute') // TODO: support non-string className attribute
      }
    }
    else if (classNames.length) {
      finalPath.node.openingElement.attributes.push(jsxAttribute(jsxIdentifier('className'), stringLiteral(classNames.join(' '))))
    }
  }

  const { impacted } = traverseComponent(sourceComponentAddress, targetHierarchyId, onSuccess)

  await processImpactedFileNodes(impacted)

  if (classNames.length) {
    const selector = `.${classNames[classNames.length - 1]}`

    for (const breakpoint of breakpoints.sort(sortBreakpoints)) {
      await appendCssSelector(indexCssNode, selector, breakpoint)
    }
  }

  return {
    returnValue: true,
    description: `${classNames.length ? `Add className '${classNames.join(' ')}' to` : 'Remove className on'} ${componentName} in ${componentNode.payload.name}`,
  }
}

export default composeHistoryMutation(createCssClassMutation)
