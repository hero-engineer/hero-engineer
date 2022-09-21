import fs from 'fs'

import { FileType, FunctionType, GraphType, getNodesByRole, getNodesBySecondNeighbourg } from 'ecu-common'
import { transformSync } from '@babel/core'
import { JSXAttribute, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'

function createHierachyId(graph: GraphType) {
  getNodesByRole<FunctionType>(graph, 'Function')
  .filter(node => node.payload.isComponent)
  .forEach(componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileType>(graph, componentNode.address, 'declaresFunction')[0]

    if (!fileNode) return

    const output = transformSync(fileNode.payload.text, {
      plugins: [
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
        '@babel/plugin-syntax-jsx',
        function addIdPropPlugin() {
          let cursor = 0

          return {
            visitor: {
              JSXOpeningElement(path: any) {
                // Remove previous id props
                do {
                  const idIndex = path.node.attributes.findIndex((x: JSXAttribute) => x.name.name === 'id')

                  if (idIndex === -1) break

                  path.node.attributes.splice(idIndex, 1)
                } while (true)

                // Add id prop
                path.node.attributes.push(
                  jsxAttribute(
                    jsxIdentifier('id'),
                    stringLiteral(`${componentNode.address}_${cursor++}`),
                  )
                )
              },
            },
          }
        },
      ],
    })

    fs.writeFileSync(fileNode.payload.path, output.code, 'utf-8')
  })
}

export default createHierachyId
