import path from 'path'

import {
  File,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'
import { ParseResult } from '@babel/parser'

import { FileNodeType, FunctionNodeType, ImportDeclarationsRegistry } from '../types'
import { ecuPropName } from '../configuration'

import { getNodesByRole } from '../graph'

import areArraysEqual from '../utils/areArraysEqual'
import areArraysEqualAtStart from '../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../utils/possiblyAddExtension'

import extractIdsAndIndexes from './extractIdsAndIndexes'

type ImpactedType = {
  fileNode: FileNodeType
  ast: ParseResult<File>
  importDeclarationsRegistry: ImportDeclarationsRegistry
}

function updateComponentHierarchy(
  fileNode: FileNodeType,
  hierarchyIds: string[],
  mutate: (x: any, previousX: any) => void,
): ImpactedType[] {
  console.log('updateComponentHierarchy', fileNode.payload.name, hierarchyIds)

  if (!hierarchyIds.length) {
    console.log('No hierarchy')

    return []
  }

  const impacted: ImpactedType[] = [] // retval
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const fileNodes = getNodesByRole<FileNodeType>('File')
  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)
  const lastingHierarchyIds: string[] = []
  const lastingIndexRegistry: Record<string, number> = {}

  console.log('ids', ids)
  console.log('indexes', indexes)
  console.log('___start___')

  function isSuccessiveNodeFound(nextHierarchyId: string) {
    const nextHierarchyIds = [...lastingHierarchyIds, nextHierarchyId]

    return areArraysEqualAtStart(nextHierarchyIds, ids) && areArraysEqualAtStart(nextHierarchyIds.map(h => lastingIndexRegistry[h]), indexes)
  }

  function isNodeFound() {
    return areArraysEqual(lastingHierarchyIds, ids) && areArraysEqual(lastingHierarchyIds.map(hierarchyId => lastingIndexRegistry[hierarchyId]), indexes)
  }

  function performMutation(x: any, previousX: any = null) {
    mutate(x, previousX)

    if (previousX) {
      previousX.stop()
    }

    x.stop()
  }

  function traverseFileNode(fileNode: FileNodeType, previousX: any = null) {
    const { ast } = fileNode.payload
    const importDeclarationsRegistry: ImportDeclarationsRegistry = {}

    if (!impacted.some(x => x.fileNode.address === fileNode.address)) {
      impacted.push({ fileNode, ast, importDeclarationsRegistry })
    }

    traverse(ast, {
      ImportDeclaration(x: any) {
        if (!importDeclarationsRegistry[fileNode.address]) {
          importDeclarationsRegistry[fileNode.address] = []
        }

        importDeclarationsRegistry[fileNode.address].push({
          value: x.node.source.value,
          specifiers: x.node.specifiers.map((x: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => x.local.name),
        })
      },
      JSXElement(x: any) {
        if (!x.node) return

        const idIndex = x.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

        // hierarchyId found means we're at an ecu-client Component
        if (idIndex !== -1) {
          const hierarchyId = x.node.openingElement.attributes[idIndex].value.value

          if (hierarchyId) {
            console.log('-->', hierarchyId)

            lastingIndexRegistry[hierarchyId] = lastingIndexRegistry[hierarchyId] + 1 || 0

            if (isSuccessiveNodeFound(hierarchyId)) {
              lastingHierarchyIds.push(hierarchyId)

              console.log('PUSHED')

              if (isNodeFound()) {
                console.log('SUCCESS')

                performMutation(x, previousX)
                // console.log('currentHierarchyIds', currentHierarchyIds)
                // console.log('currentIndexRegistry', currentIndexRegistry)
              }
            }
          }
        }
        // No hierarchyId found means we're at an imported Component node
        else {
          const importDeclarations = importDeclarationsRegistry[fileNode.address]

          if (importDeclarations.length) {
            const componentName = x.node.openingElement.name.name
            const relativeImportDeclaration = importDeclarations.find(x => x.value.startsWith('.') && x.specifiers.includes(componentName))

            if (relativeImportDeclaration) {
              const absolutePath = possiblyAddExtension(path.join(path.dirname(fileNode.payload.path), relativeImportDeclaration.value))

              // console.log('-->', absolutePath)

              const componentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (componentNode) {
                // console.log('componentNode.payload.name', componentNode.payload.name)

                const fileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (fileNode) {
                  console.log('-->', fileNode.payload.name)

                  traverseFileNode(fileNode, x)
                }
              }
            }
          }
        }

        // console.log('currentHierarchyIds', currentHierarchyIds)
        // console.log('currentIndexRegistry', currentIndexRegistry)
      },
    })
  }

  traverseFileNode(fileNode)

  return impacted
}

export default updateComponentHierarchy
