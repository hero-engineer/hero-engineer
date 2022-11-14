import path from 'node:path'

import { File, JSXAttribute, JSXElement, JSXIdentifier, StringLiteral, file } from '@babel/types'
import traverse, { NodePath } from '@babel/traverse'

import { ParseResult } from '@babel/core'

import { xor } from 'lodash'

import { FileNodeType, FunctionNodeType, HierarchyTreeType, ImpactedType, ImportType, ImportsRegistry, IndexRegistryType } from '../../types'
import { ecuPropName } from '../../configuration'

import { getNodeByAddress, getNodesByFirstNeighbourg, getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'

import areArraysEqual from '../../utils/areArraysEqual'
import areArraysEqualAtStart from '../../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

import createHierarchyId from '../utils/createHierarchyId'
import extractIdAndIndex from '../utils/extractIdAndIndex'
import extractIdsAndIndexes from '../utils/extractIdsAndIndexes'
import formatHierarchyTrees from '../utils/formatHierarchyTrees'

type TraverseComponentReturnType = {
  impacted: ImpactedType[],
  hierarchy: HierarchyTreeType | null,
}

type TraverseComponentHierarchyTreeContextType = {
  useAst?: boolean
  fileNode: FileNodeType
  paths: NodePath<JSXElement>[]
}

type TraverseComponentHierarchyTreeType = Omit<HierarchyTreeType, 'children'> & {
  context: TraverseComponentHierarchyTreeContextType
  childrenContext: null | TraverseComponentHierarchyTreeContextType
  children: TraverseComponentHierarchyTreeType[]
}

function postProcessHierarchy(hierarchy: TraverseComponentHierarchyTreeType) {
  // @ts-expect-error
  delete hierarchy.context
  // @ts-expect-error
  delete hierarchy.childrenContext

  hierarchy.children.forEach(postProcessHierarchy)
}

function traverseComponent(componentAddress: string, targetHierarchyId = '', onSuccess: (paths: any[]) => void = () => {}): TraverseComponentReturnType {
  // console.log('traverseComponent', componentAddress, hierarchyIds)

  const componentNode = getNodeByAddress<FunctionNodeType>(componentAddress)

  if (!componentNode) {
    console.log(`No component node found for component ${componentAddress}`)

    return {
      impacted: [],
      hierarchy: null,
    }
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentAddress, 'DeclaresFunction')[0]

  if (!fileNode) {
    console.log(`No file node found for component ${componentAddress}`)

    return {
      impacted: [],
      hierarchy: null,
    }
  }

  const impacted: ImpactedType[] = [] // retval
  const rootHierarchy: TraverseComponentHierarchyTreeType = { // retval
    context: {
      useAst: true,
      fileNode,
      paths: [],
    },
    childrenContext: null,
    fileAddress: fileNode.address,
    componentAddress: componentNode.address,
    onComponentAddress: componentNode.address,
    componentName: componentNode.payload.name,
    label: componentNode.payload.name,
    index: 0,
    hierarchyId: '',
    children: [],
  }
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const importsRegistry: ImportsRegistry = {}
  const lastingIndexRegistry: IndexRegistryType = {}

  function buildImportsRegistry(fileNode: FileNodeType) {
    // Build the importsRegistry for the file
    traverse(fileNode.payload.ast, {
      ImportDeclaration(x) {
        if (!importsRegistry[fileNode.address]) {
          importsRegistry[fileNode.address] = []
        }

        x.node.specifiers.forEach(specifier => {
          importsRegistry[fileNode.address].push({
            source: x.node.source.value,
            name: specifier.local.name,
            type: specifier.type,
          })
        })
      },
    })

    const importedFileNodes = getNodesByFirstNeighbourg<FileNodeType>(fileNode.address, 'ImportsFile')

    importedFileNodes.forEach(fileNode => {
      if (importsRegistry[fileNode.address]) return

      buildImportsRegistry(fileNode)
    })
  }

  function getComponentHierarchyId(jsxElement: JSXElement) {
    const jsxAttributes = jsxElement.openingElement.attributes.filter(a => a.type === 'JSXAttribute') as JSXAttribute[]

    const idIndex = jsxAttributes.findIndex(x => x.name.name === ecuPropName)

    if (!(idIndex !== -1 && jsxAttributes[idIndex].value?.type === 'StringLiteral')) return null

    const limitedHierarchyId = (jsxAttributes[idIndex].value as StringLiteral).value

    if (!limitedHierarchyId) return null

    lastingIndexRegistry[limitedHierarchyId] = lastingIndexRegistry[limitedHierarchyId] + 1 || 0

    return createHierarchyId(limitedHierarchyId, lastingIndexRegistry[limitedHierarchyId])
  }

  function getComponentFileNode(jsxElement: JSXElement, fileNode: FileNodeType) {
    const imports = importsRegistry[fileNode.address] || []

    if (!imports.length) return null

    const componentName = (jsxElement.openingElement.name as JSXIdentifier)?.name
    const relativeImportDeclaration = imports.find(x => x.name === componentName)

    if (!relativeImportDeclaration) return null
    const absolutePath = possiblyAddExtension(path.join(path.dirname(fileNode.payload.path), relativeImportDeclaration.source), fileNode.payload.extension)
    const nextComponentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

    if (!nextComponentNode) return null

    return getNodesBySecondNeighbourg<FileNodeType>(nextComponentNode.address, 'DeclaresFunction')[0]
  }

  function dfs(hierarchy: TraverseComponentHierarchyTreeType, useChildrenPath = false) {
    // console.log('-->', hierarchy.componentName, useChildrenPath ? 'children path' : '')

    const indexRegistry: IndexRegistryType = {}
    const hasChildrenPath = !!(useChildrenPath && hierarchy.childrenContext)
    const hasAst = !hasChildrenPath && hierarchy.context.useAst
    const ast = hasAst ? hierarchy.context.fileNode.payload.ast : null
    const path = hasAst ? null : hasChildrenPath ? hierarchy.childrenContext!.paths[0] : hierarchy.context.paths[hierarchy.context.paths.length - 1]
    const scope = hasAst ? undefined : (path as NodePath).scope
    const parentPath = hasAst ? undefined : (path as NodePath).parentPath

    if (ast && !impacted.some(x => x.fileNode.address === hierarchy.context.fileNode.address)) {
      impacted.push({ fileNode, ast })
    }

    traverse(hasAst ? ast : path?.node, {
      JSXElement(x) {
        x.skip()

        const componentName = (x.node.openingElement.name as JSXIdentifier)?.name || 'Component'
        const index = indexRegistry[componentName] = indexRegistry[componentName] + 1 || 0
        const nextPaths = [...hierarchy.context.paths, x]
        const hierarchyId = getComponentHierarchyId(x.node)

        // console.log('JSXElement', componentName)

        // hierarchyId found means we're at an ecu-client Component
        if (hierarchyId) {
          hierarchy.children.push({
            context: {
              fileNode: hierarchy.context.fileNode,
              paths: nextPaths,
            },
            childrenContext: hierarchy.childrenContext,
            fileAddress: hierarchy.context.fileNode.address,
            componentAddress: hierarchy.componentAddress,
            onComponentAddress: hierarchy.componentAddress,
            componentName,
            index,
            label: `${componentName}[${index}]`,
            hierarchyId,
            children: [],
          })

          if (hierarchyId === targetHierarchyId) {
            onSuccess(nextPaths)
          }
        }
        else {
          const componentFileNode = getComponentFileNode(x.node, hasChildrenPath ? hierarchy.childrenContext!.fileNode : hierarchy.context.fileNode)

          if (componentFileNode) {
            const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(componentFileNode.address, 'DeclaresFunction')[0]

            if (componentNode) {
              hierarchy.children.push({
                context: {
                  useAst: true,
                  fileNode: componentFileNode,
                  paths: nextPaths,
                },
                childrenContext: {
                  fileNode: hierarchy.childrenContext?.fileNode || hierarchy.context.fileNode,
                  paths: [x],
                },
                fileAddress: componentFileNode.address,
                componentAddress: componentNode.address,
                onComponentAddress: hierarchy.componentAddress,
                componentName,
                index,
                label: `${componentName}[${index}]`,
                hierarchyId: '',
                children: [],
              })
            }
            // else {
            //   console.log(`No component node found for component ${componentName}`)
            // }
          }
          // else {
          //   console.log('No component file node found for', componentName)
          // }
        }
      },
      JSXExpressionContainer(x) {
        if (!(x.node.expression.type === 'Identifier' && x.node.expression.name === 'children')) return

        // console.log('CHILDREN')

        dfs(hierarchy, true)
      },
    }, scope, parentPath)

    if (!hasChildrenPath) {
      // console.log('About to traverse children of', hierarchy.label)
      hierarchy.children.forEach(childHierarchy => {
        dfs(childHierarchy)
      })
      // console.log('End traversal of', hierarchy.label)
    }

  }

  buildImportsRegistry(fileNode)
  dfs(rootHierarchy)
  postProcessHierarchy(rootHierarchy)

  // console.log('\n\n!!!!')
  // console.log('hierarchy', JSON.stringify(rootHierarchy, null, 2))

  return {
    impacted,
    hierarchy: rootHierarchy as HierarchyTreeType,
  }
}

export default traverseComponent
