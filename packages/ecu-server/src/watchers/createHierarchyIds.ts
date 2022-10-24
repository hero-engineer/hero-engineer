import fs from 'fs'

import { transformSync } from '@babel/core'
import { JSXAttribute, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'

import { FileNodeType, FunctionNodeType, GraphType } from '../types'

import { getNodesByRole, getNodesBySecondNeighbourg } from '../graph/helpers'

function createHierachyIds(graph: GraphType) {
  getNodesByRole<FunctionNodeType>(graph, 'Function')
  .filter(node => node.payload.isComponent)
  .forEach(componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileNodeType>(graph, componentNode.address, 'declaresFunction')[0]

    if (!fileNode) return

    const output = transformSync(fileNode.payload.text, {
      plugins: [
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
        '@babel/plugin-syntax-jsx',
        function addIdPropPlugin() {
          const propName = 'data-ecu'
          let cursor = 0

          return {
            visitor: {
              JSXOpeningElement(path: any) {
                // Remove previous id props
                do {
                  const idIndex = path.node.attributes.findIndex((x: JSXAttribute) => x.name.name === propName)

                  if (idIndex === -1) break

                  path.node.attributes.splice(idIndex, 1)
                } while (true)

                // Add id prop
                path.node.attributes.push(
                  jsxAttribute(
                    jsxIdentifier(propName),
                    stringLiteral(`${componentNode.address}_${cursor++}`),
                  )
                )
              },
            },
          }
        },
      ],
    })

    fs.writeFileSync(fileNode.payload.path, output?.code || '', 'utf-8')
  })
}

export default createHierachyIds
