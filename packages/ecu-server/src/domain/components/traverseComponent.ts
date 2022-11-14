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
// import formatHierarchyTrees from '../utils/formatHierarchyTrees'

type TraverseComponentEventsType = {
  onTraverseFile?: (fileNodes: FileNodeType[]) => void
  onHierarchyPush?: (paths: any[], fileNodes: FileNodeType[], hierarchyTree: HierarchyTreeType) => void
  onSuccess?: (paths: any[], fileNodes: FileNodeType[], hierarchyTree: HierarchyTreeType) => void
}

type TraverseComponentReturnType = {
  impacted: ImpactedType[],
  hierarchy: HierarchyTreeType[],
}

type TraverseComponentHierarchyType = {
  index: number,
  label: string,
  fileNode: FileNodeType
  fileAddress: string
  componentAddress: string
  // onComponentAddress: string
  path: NodePath<JSXElement> | null
  componentName: string
  hierarchyId: string
  children: TraverseComponentHierarchyType[]
}

function postProcessHierarchy(hierarchy: TraverseComponentHierarchyType) {
  // @ts-expect-error
  delete hierarchy.fileNode
  // @ts-expect-error
  delete hierarchy.path

  hierarchy.children.forEach(postProcessHierarchy)
}

function traverseComponent(componentAddress: string, hierarchyIds: string[], events: TraverseComponentEventsType = {}): TraverseComponentReturnType {
  // console.log('traverseComponent', componentAddress, hierarchyIds)

  const componentNode = getNodeByAddress<FunctionNodeType>(componentAddress)

  if (!componentNode) {
    console.log(`No component node found for component ${componentAddress}`)

    return {
      impacted: [],
      hierarchy: [],
    }
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentAddress, 'DeclaresFunction')[0]

  if (!fileNode) {
    console.log(`No file node found for component ${componentAddress}`)

    return {
      impacted: [],
      hierarchy: [],
    }
  }

  const {
    onTraverseFile = () => {},
    onHierarchyPush = () => {},
    onSuccess = () => {},
  } = events

  const impacted: ImpactedType[] = [] // retval
  const hierarchyTrees: HierarchyTreeType[] = [] // retval
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const allFileNodes = getNodesByRole<FileNodeType>('File')
  const importsRegistry: ImportsRegistry = {}
  const lastingHierarchyIds: string[] = []
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

    // hierarchyId found means we're at an ecu-client Component
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

  function bfs(hierarchy: TraverseComponentHierarchyType) {
    console.log('-->', hierarchy.componentName)

    const componentNameToIndex: Record<string, number> = {}
    const ast = hierarchy.path ? null : hierarchy.fileNode.payload.ast
    const scope = hierarchy.path ? hierarchy.path.scope : undefined
    const parentPath = hierarchy.path ? hierarchy.path.parentPath : undefined

    if (ast && !impacted.some(x => x.fileNode.address === hierarchy.fileNode.address)) {
      impacted.push({ fileNode, ast })
    }

    traverse(ast || hierarchy.path?.node, {
      JSXElement(x) {
        const hierarchyId = getComponentHierarchyId(x.node)
        const componentName = (x.node.openingElement.name as JSXIdentifier)?.name || 'Component'

        const index = componentNameToIndex[componentName] = componentNameToIndex[componentName] + 1 || 0

        if (hierarchyId) {
          hierarchy.children.push({
            fileNode: hierarchy.fileNode,
            path: x,
            fileAddress: hierarchy.fileNode.address,
            componentAddress: hierarchy.componentAddress,
            componentName,
            index,
            label: `${componentName}[${index}]`,
            hierarchyId,
            children: [],
          })
        }
        else {
          const componentFileNode = getComponentFileNode(x.node, hierarchy.fileNode)

          if (componentFileNode) {
            const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(componentFileNode.address, 'DeclaresFunction')[0]

            if (componentNode) {
              hierarchy.children.push({
                fileNode: componentFileNode,
                path: null,
                fileAddress: componentFileNode.address,
                componentAddress: componentNode.address,
                componentName,
                index,
                label: `${componentName}[${index}]`,
                hierarchyId: '',
                children: [],
              })
            }
          }
        }

        x.skip()
      },
    }, scope, parentPath)

    hierarchy.children.forEach(hierarchyChild => {
      bfs(hierarchyChild)
    })
  }

  buildImportsRegistry(fileNode)

  const hierarchy: TraverseComponentHierarchyType = {
    fileNode,
    path: null,
    fileAddress: fileNode.address,
    componentAddress: componentNode.address,
    componentName: componentNode.payload.name, // TODO component name
    index: 0,
    label: componentNode.payload.name,
    hierarchyId: '',
    children: [],
  }

  bfs(hierarchy)

  postProcessHierarchy(hierarchy)
  console.log('\n\n!!!!')
  console.log('hierarchy', JSON.stringify(hierarchy, null, 2))

  return {
    impacted,
    hierarchy: hierarchyTrees,
  }
}

export default traverseComponent
