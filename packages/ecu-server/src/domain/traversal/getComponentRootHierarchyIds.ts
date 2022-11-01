import path from 'path'

import {
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  JSXAttribute,
} from '@babel/types'
import traverse from '@babel/traverse'

import { ecuPropName } from '../../configuration'
import { FileNodeType, FunctionNodeType, ImportDeclarationsRegistry } from '../../types'

import { getNodeByAddress, getNodesByFirstNeighbourg, getNodesByRole, getNodesBySecondNeighbourg } from '../../graph'
import possiblyAddExtension from '../../utils/possiblyAddExtension'

function getComponentRootHierarchyIds(sourceComponentAddress: string): string[] {
  console.log('getComponentRootHierarchyIds')

  const componentNode = getNodeByAddress<FunctionNodeType>(sourceComponentAddress)

  if (!componentNode) {
    console.log(`Component node with id ${sourceComponentAddress} not found`)

    return []
  }

  const fileNode = getNodesBySecondNeighbourg<FileNodeType>(componentNode.address, 'DeclaresFunction')[0]

  if (!fileNode) {
    console.log(`Function for component node with id ${sourceComponentAddress} not found`)

    return []
  }

  const hierarchyIds: string[] = [] // retval
  const fileNodes = getNodesByRole<FileNodeType>('File')
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)

  console.log('___start___')

  function traverseFileNode(fileNode: FileNodeType, skip = () => {}) {
    console.log('---->', fileNode.payload.name)

    const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

    if (!componentNode) {
      console.log(`No component node found in file ${fileNode.address}`)

      return
    }

    const importDeclarationsRegistry: ImportDeclarationsRegistry = {}

    traverse(fileNode.payload.ast, {
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

            hierarchyIds.push(hierarchyId)

            console.log('PUSHED')

            x.skip()
            skip()
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

              console.log('-->', absolutePath)

              const componentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

              if (componentNode) {
                // console.log('componentNode.payload.name', componentNode.payload.name)

                const fileNode = fileNodes.find(n => n.payload.path === componentNode.payload.path)

                if (fileNode) {
                  console.log('-->', fileNode.payload.name)

                  traverseFileNode(
                    fileNode,
                    () => {
                      x.skip()
                      skip()
                    }
                  )
                }
              }
            }
          }
        }
      },
    })
  }

  traverseFileNode(fileNode)

  return hierarchyIds
}

export default getComponentRootHierarchyIds
