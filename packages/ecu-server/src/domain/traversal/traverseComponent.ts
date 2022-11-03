import path from 'path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { FileNodeType, FunctionNodeType, ImpactedType, ImportDeclarationsRegistry, IndexRegistryType, MutateType } from '../../types'
import { ecuPropName } from '../../configuration'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'

import areArraysEqual from '../../utils/areArraysEqual'
import areArraysEqualAtStart from '../../utils/areArraysEqualAtStart'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

import extractIdsAndIndexes from '../utils/extractIdsAndIndexes'

type TraverseComponentConfigType = {
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
    onSuccess = () => {},
  } = config

  const impacted: ImpactedType[] = [] // retval
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const fileNodes = getNodesByRole<FileNodeType>('File')
  const [ids, indexes] = extractIdsAndIndexes(hierarchyIds)
  const lastingHierarchyIds: string[] = []
  const lastingIndexRegistry: IndexRegistryType = {}
  const importDeclarationsRegistry: ImportDeclarationsRegistry = {}

  console.log('ids', ids)
  console.log('indexes', indexes)

  function isSuccessiveNodeFound(nextHierarchyId: string) {
    const nextHierarchyIds = [...lastingHierarchyIds, nextHierarchyId]

    if (areArraysEqualAtStart(nextHierarchyIds, ids)) {
      console.log('x', indexes, nextHierarchyIds.map(h => lastingIndexRegistry[h]))
    }

    return areArraysEqualAtStart(nextHierarchyIds, ids) && areArraysEqualAtStart(nextHierarchyIds.map(h => lastingIndexRegistry[h]), indexes)
  }

  function isFinalNodeFound() {
    return areArraysEqual(lastingHierarchyIds, ids) && areArraysEqual(lastingHierarchyIds.map(hierarchyId => lastingIndexRegistry[hierarchyId]), indexes)
  }

  function traverseFile(fileNode: FileNodeType, previousX: any = null, stop = () => {}) {
    const { ast } = fileNode.payload

    if (!impacted.some(x => x.fileNode.address === fileNode.address)) {
      impacted.push({ fileNode, ast, importDeclarationsRegistry })
    }

    const traverser = {
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
      JSXElement(x: any) {
        console.log('___', x.node.openingElement.name.name)
        const idIndex = x.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === ecuPropName)

        // hierarchyId found means we're at an ecu-client Component
        if (idIndex !== -1) {
          const hierarchyId = x.node.openingElement.attributes[idIndex].value.value

          if (hierarchyId) {
            lastingIndexRegistry[hierarchyId] = lastingIndexRegistry[hierarchyId] + 1 || 0

            console.log('-->', x.node.openingElement.name.name, hierarchyId, lastingIndexRegistry[hierarchyId])

            if (isSuccessiveNodeFound(hierarchyId)) {
              lastingHierarchyIds.push(hierarchyId)

              console.log('PUSHED')

              if (isFinalNodeFound()) {
                console.log('SUCCESS')

                onSuccess(x)
                x.stop()
                stop()
              }
            }
          }
        }
        // No hierarchyId found means we're at an imported Component node
        else {
          const importDeclarations = importDeclarationsRegistry[fileNode.address]

          // console.log('fileNode.address', fileNode.address)
          // console.log('importDeclarations', importDeclarations)
          if (importDeclarations.length) {
            const componentName = x.node.openingElement.name.name
            const relativeImportDeclaration = importDeclarations.find(x => x.value.startsWith('.') && x.specifiers.includes(componentName))

            if (relativeImportDeclaration) {
              const absolutePath = possiblyAddExtension(path.join(path.dirname(fileNode.payload.path), relativeImportDeclaration.value))
              const componentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (componentNode) {
                const fileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (fileNode) {
                  console.log('-->', fileNode.payload.name)

                  // console.log('x.get', x.get('children'))

                  traverseFile(
                    fileNode,
                    x,
                    () => {
                      x.stop()
                      stop()
                    },
                  )

                  // console.log('skipping')
                  // x.skip()
                }
              }
            }
          }
        }

        // console.log('<--')
        // console.log('lastingHierarchyIds', lastingHierarchyIds)
        // console.log('lastingIndexRegistry', lastingIndexRegistry)
      },
      JSXExpressionContainer(x: any) {
        if (!(x.node.expression.type === 'Identifier' && x.node.expression.name === 'children')) return
        console.log('previousX', !!previousX)
        if (!previousX) return

        console.log('START Traversing children of', previousX.node.openingElement.name.name)
        previousX.traverse(traverser)
        console.log('END traversing children of', previousX.node.openingElement.name.name)
      },
    }

    traverse(ast, traverser)
  }

  traverseFile(fileNode)

  return impacted
}

export default traverseComponent
