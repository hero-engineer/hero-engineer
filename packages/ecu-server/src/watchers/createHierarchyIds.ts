import { JSXAttribute, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'

import { FileNodeType, FunctionNodeType, GraphType } from '../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph/helpers'
import lintFile from '../domain/lintFile'
import transformFileCode from '../domain/transformFileCode'

async function createHierachyIds(graph: GraphType) {
  const componentNodes = getNodesByRole<FunctionNodeType>(graph, 'Function').filter(node => node.payload.isComponent)

  for (const componentNode of componentNodes) {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, componentNode.address, 'declaresFunction')[0]

    if (!fileNode) return

    transformFileCode(fileNode, () => {
      const propName = 'data-ecu'
      const cursors: number[] = [0]
      const importedComponentNames: string[] = []

      return {
        visitor: {
          ImportDeclaration(path: any) {
            if (path.node.source.value === 'ecu-client') return

            path.node.specifiers.forEach((node: any) => {
              importedComponentNames.push(node.local.name)
            })
          },
          JSXElement(path: any) {
            if (importedComponentNames.includes(path.node.openingElement.name.name)) return

            // Remove previous id props
            do {
              const idIndex = path.node.openingElement.attributes.findIndex((x: JSXAttribute) => x.name.name === propName)

              if (idIndex === -1) break

              path.node.openingElement.attributes.splice(idIndex, 1)
            } while (true)

            // Add id prop
            path.node.openingElement.attributes.push(
              jsxAttribute(
                jsxIdentifier(propName),
                stringLiteral(`${componentNode.address}:${cursors.join('_')}`),
              )
            )

            if (path.node.closingElement) {
              cursors.push(0)
            }
            else {
              cursors[cursors.length - 1]++
            }
          },
          JSXClosingElement() {
            cursors.pop()
            cursors[cursors.length - 1]++
          },
        },
      }
    })

    await lintFile(fileNode.payload.path)
  }
}

export default createHierachyIds
