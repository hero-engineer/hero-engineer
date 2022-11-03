import path from 'path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { FileNodeType, FunctionNodeType, ImpactedType, ImportDeclarationsRegistry, IndexRegistryType } from '../../types'
import { ecuPropName } from '../../configuration'

import { getNodesByFirstNeighbourg, getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'

import areArraysEqual from '../../utils/areArraysEqual'
import areArraysEqualAtStart from '../../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

import createHierarchyId from '../utils/createHierarchyId'
import extractIdAndIndex from '../utils/extractIdAndIndex'
import extractIdsAndIndexes from '../utils/extractIdsAndIndexes'

type TraverseComponentConfigType = {
  onTraverseFile?: (fileNode: FileNodeType, index: number) => () => void
  onHierarchyPush?: (x: any, hierarchyId: string, index: number) => void
  onSuccess?: (x: any) => void
}

function traverseComponent(componentAddress: string, hierarchyIds: string[], config: TraverseComponentConfigType = {}): ImpactedType[] {
  console.log('traverseComponent', componentAddress, hierarchyIds)

  if (!hierarchyIds.length) {
    console.log('No hierarchy')

    return []
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentAddress, 'DeclaresFunction')[0]

  if (!fileNode) {
    console.log(`No file node found for component ${componentAddress}`)

    return []
  }

  const {
    onTraverseFile = () => () => {},
    onHierarchyPush = () => {},
    onSuccess = () => {},
  } = config

  const impacted: ImpactedType[] = [] // retval
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const fileNodes = getNodesByRole<FileNodeType>('File')
  const [, indexes] = extractIdsAndIndexes(hierarchyIds)
  const lastingHierarchyIds: string[] = []
  const lastingIndexRegistry: IndexRegistryType = {}
  const importDeclarationsRegistry: ImportDeclarationsRegistry = {}

  // console.log('ids', ids)
  // console.log('indexes', indexes)

  function isSuccessiveNodeFound(nextHierarchyId: string) {
    const nextHierarchyIds = [...lastingHierarchyIds, nextHierarchyId]
    const [nextLimitedHierarchyId] = extractIdAndIndex(nextHierarchyId)

    return areArraysEqualAtStart(nextHierarchyIds, hierarchyIds) && lastingIndexRegistry[nextLimitedHierarchyId] === indexes[nextHierarchyIds.length - 1]
  }

  function isFinalNodeFound() {
    const lastingHierarchyIdsIndexes = lastingHierarchyIds.map(hierarchyId => extractIdAndIndex(hierarchyId)[1])

    return areArraysEqual(lastingHierarchyIds, hierarchyIds) && areArraysEqual(lastingHierarchyIdsIndexes, indexes)
  }

  function traverseFileNodesToFindImportDeclarations(fileNode: FileNodeType) {
    traverse(fileNode.payload.ast, {
      // Build the importDeclarationsRegistry for the file
      ImportDeclaration(x: any) {
        if (!importDeclarationsRegistry[fileNode.address]) {
          importDeclarationsRegistry[fileNode.address] = []
        }

        importDeclarationsRegistry[fileNode.address].push({
          value: x.node.source.value,
          specifiers: x.node.specifiers.map((x: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => x.local.name),
        })
      },
    })

    const importedFileNodes = getNodesByFirstNeighbourg<FileNodeType>(fileNode.address, 'ImportsFile')

    importedFileNodes.forEach(fileNode => {
      if (importDeclarationsRegistry[fileNode.address]) return

      traverseFileNodesToFindImportDeclarations(fileNode)
    })
  }

  function traverseFileNode(fileNode: FileNodeType, previousFileNode: FileNodeType | null = null, previousX: any = null, index = 0, stop = () => {}) {
    console.log('-> traverseFileNode', fileNode.payload.name)

    const onContinue = onTraverseFile(fileNode, index)

    const { ast } = fileNode.payload
    const indexRegistries: IndexRegistryType[] = [{}]
    let shouldContinue = true
    let shouldPushIndex = true

    if (!impacted.some(x => x.fileNode.address === fileNode.address)) {
      impacted.push({ fileNode, ast, importDeclarationsRegistry })
    }

    function createTraverser(currentFileNode: FileNodeType) {
      const importDeclarations = importDeclarationsRegistry[currentFileNode.address] || []

      return {
        JSXElement(x: any) {
          console.log('--> JSXElement', x.node.openingElement.name.name)

          const idIndex = x.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

          // hierarchyId found means we're at an ecu-client Component
          if (idIndex !== -1) {
            const limitedHierarchyId = x.node.openingElement.attributes[idIndex].value.value

            if (limitedHierarchyId) {
              const [componentAddress] = extractIdAndIndex(limitedHierarchyId)

              indexRegistries[indexRegistries.length - 1][componentAddress] = indexRegistries[indexRegistries.length - 1][componentAddress] + 1 || 0
              lastingIndexRegistry[limitedHierarchyId] = lastingIndexRegistry[limitedHierarchyId] + 1 || 0
              shouldPushIndex = true

              console.log('--->', x.node.openingElement.name.name, limitedHierarchyId, lastingIndexRegistry[limitedHierarchyId])

              const hierarchyId = createHierarchyId(limitedHierarchyId, lastingIndexRegistry[limitedHierarchyId])

              if (isSuccessiveNodeFound(hierarchyId)) {
                lastingHierarchyIds.push(hierarchyId)

                console.log('PUSHED')

                onHierarchyPush(x, hierarchyId, indexRegistries[indexRegistries.length - 1][componentAddress])

                if (isFinalNodeFound()) {
                  console.log('SUCCESS')

                  shouldContinue = false

                  onSuccess(x)
                  x.stop()
                  stop()
                }
              }
            }
          }
          // No hierarchyId found means we're at an imported Component node
          else if (importDeclarations.length) {
            const componentName = x.node.openingElement.name.name
            const relativeImportDeclaration = importDeclarations.find(x => x.value.startsWith('.') && x.specifiers.includes(componentName))

            if (relativeImportDeclaration) {
              const absolutePath = possiblyAddExtension(path.join(path.dirname(currentFileNode.payload.path), relativeImportDeclaration.value))
              const componentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (componentNode) {
                const nextFileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (nextFileNode) {
                  console.log('--->', nextFileNode.payload.name)

                  indexRegistries[indexRegistries.length - 1][nextFileNode.payload.name] = indexRegistries[indexRegistries.length - 1][nextFileNode.payload.name] + 1 || 0
                  shouldPushIndex = false

                  traverseFileNode(
                    nextFileNode,
                    currentFileNode,
                    x,
                    indexRegistries[indexRegistries.length - 1][nextFileNode.payload.name],
                    () => {
                      shouldContinue = false

                      x.stop()
                      stop()
                    },
                  )

                  console.log('SKIPPING')

                  x.skip()
                }
              }
            }
          }

          if (!x.node.selfClosing && shouldPushIndex) {
            indexRegistries.push({})
          }
        },
        JSXClosingElement() {
          // Prevent fragments from interering with indexing
          if (indexRegistries.length > 1) {
            indexRegistries.pop()
          }
        },
        JSXExpressionContainer(x: any) {
          if (!(x.node.expression.type === 'Identifier' && x.node.expression.name === 'children')) return
          if (!(previousX && previousFileNode)) return

          // If children is found, traverse children with new traverser
          previousX.traverse(createTraverser(previousFileNode))
        },
      }
    }

    traverse(ast, createTraverser(fileNode))

    if (shouldContinue) {
      onContinue()
    }
  }

  traverseFileNodesToFindImportDeclarations(fileNode)
  traverseFileNode(fileNode)

  return impacted
}

export default traverseComponent
