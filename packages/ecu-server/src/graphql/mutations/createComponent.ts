import fs from 'fs'
import path from 'path'

import { FunctionNodeType } from '../../types'
import { appPath } from '../../configuration'

import createComponentTemplate from '../../templates/Component'

import graph from '../../graph'
import { getNodesByFirstNeighbourg } from '../../graph/helpers'
import addFile from '../../graph/add/addFile'
import addFileDependencies from '../../graph/add/addFileDependencies'

import nodeWithId from '../../utils/nodeWithId'
import capitalize from '../../utils/capitalize'

type CreateComponentArgs = {
  name: string
}

function createComponent(_: any, { name }: CreateComponentArgs) {
  const validatedName = capitalize(name)
  const code = createComponentTemplate(validatedName)
  const filePath = path.join(appPath, 'src', 'components', `${validatedName}.tsx`)

  fs.writeFileSync(filePath, code, 'utf-8')

  const fileNode = addFile(graph, filePath)

  addFileDependencies(graph, fileNode)

  const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(graph, fileNode.address, 'declaresFunction')[0]

  return nodeWithId(componentNode, { file: nodeWithId(fileNode) })
}

export default createComponent
