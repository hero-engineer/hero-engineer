import fs from 'fs'

import { transformSync } from '@babel/core'
import { JSXAttribute, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'

import { FileNodeType, FunctionNodeType, GraphType } from '../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph/helpers'
import lintFile from '../domain/lintFile'

async function createHierachyIds(graph: GraphType) {
  const componentNodes = getNodesByRole<FunctionNodeType>(graph, 'Function').filter(node => node.payload.isComponent)

  for (const componentNode of componentNodes) {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, componentNode.address, 'declaresFunction')[0]

    if (!fileNode) return

    const output = transformSync(fileNode.payload.text, {
      plugins: [
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
        '@babel/plugin-syntax-jsx',
        function addIdPropPlugin() {
          const propName = 'data-ecu'
          const cursors: number[] = [0]

          return {
            visitor: {
              JSXElement(path: any) {
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
        },
      ],
    })

    fs.writeFileSync(fileNode.payload.path, output?.code || '', 'utf-8')
    await lintFile(fileNode.payload.path)
  }
}

export default createHierachyIds
