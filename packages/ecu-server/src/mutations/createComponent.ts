import fs from 'fs'
import path from 'path'

import capitalize from 'lodash/capitalize'

import { FunctionType, getNodesByFirstNeighbourg } from 'ecu-common'

import createComponentTemplate from '../templates/Component'

import configuration from '../configuration'

import graph from '../graph'
import addFile from '../graph/add/addFile'
import nodeWithId from '../utils/nodeWithId'

type CreateComponentArgs = {
  name: string
}

function createComponent(_: any, { name }: CreateComponentArgs) {
  const validatedName = capitalize(name)
  const code = createComponentTemplate(validatedName)
  const filePath = path.join(configuration.appPath, 'src', 'components', `${validatedName}.tsx`)

  fs.writeFileSync(filePath, code, 'utf-8')

  const fileNode = addFile(graph, filePath)

  const componentNode = getNodesByFirstNeighbourg<FunctionType>(graph, fileNode.address, 'declaresFunction')[0]

  return nodeWithId(componentNode, { file: nodeWithId(fileNode) })
}

export default createComponent
