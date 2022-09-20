import fs from 'fs'

import { FileType, FunctionType, GraphType, getNodesByRole, getNodesBySecondNeighbourg } from 'ecu-common'
import { transformSync } from '@babel/core'
import { JSXAttribute, jsxAttribute, jsxIdentifier, stringLiteral } from '@babel/types'

import regenerateFileFromAst from '../domain/regenerateFileFromAst'

function createHierachyId(graph: GraphType) {
  const componentNodes = getNodesByRole<FunctionType>(graph, 'Function').filter(node => node.payload.isComponent)

  componentNodes.forEach(componentNode => {
    const fileNode = getNodesBySecondNeighbourg<FileType>(graph, componentNode.address, 'declaresFunction')[0]

    if (!fileNode) return

    const output = transformSync(fileNode.payload.text, {

      plugins: [
        '@babel/plugin-syntax-jsx',
        // your first babel plugin 😎😎
        function addIdProp() {
          let cursor = 0

          return {
            visitor: {
              JSXOpeningElement(path: any) {
                let idIndex

                do {
                  idIndex = path.node.attributes.findIndex((x: JSXAttribute) => x.name.name === 'id')

                  path.node.attributes.splice(idIndex, 1)
                } while (idIndex !== -1)

                path.node.attributes.push(
                  jsxAttribute(
                    jsxIdentifier('id'),
                    stringLiteral(`${componentNode.address}_${cursor++}`),
                  )
                )

        // console.log('path.node.attributes', path.node.attributes)
              },
            },
          }
        },
      ],
    })

    // const code = regenerateFileFromAst(fileNode.payload.ast.program)

    fs.writeFileSync(fileNode.payload.path, output.code, 'utf-8')
  })
}

export default createHierachyId
