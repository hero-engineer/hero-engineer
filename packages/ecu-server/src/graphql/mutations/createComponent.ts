import fs from 'fs'
import path from 'path'

import { FunctionNodeType, HistoryMutationReturnType } from '../../types'
import { appPath } from '../../configuration'

import createComponentTemplate from '../../templates/Component'

import { getNodesByFirstNeighbourg } from '../../graph'
import addFile from '../../graph/add/addFile'
import addFileDependencies from '../../graph/add/addFileDependencies'

import createDataEcuAttributes from '../../domain/createDataEcuAttributes'
import regenerate from '../../domain/regenerate'

import capitalize from '../../utils/capitalize'

type CreateComponentArgs = {
  name: string
}

async function createComponent(_: any, { name }: CreateComponentArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
  if (!name) {
    throw new Error('Component name is required')
  }

  const validatedName = capitalize(name)
  const code = createComponentTemplate(validatedName)
  const filePath = path.join(appPath, 'src', 'components', `${validatedName}.tsx`)

  fs.writeFileSync(filePath, code, 'utf8')

  const fileNode = addFile(filePath)

  addFileDependencies(fileNode)

  const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

  const ast = createDataEcuAttributes(componentNode, fileNode.payload.ast)

  await regenerate(fileNode, ast)

  return {
    returnValue: componentNode,
    impactedFileNodes: [fileNode],
    description: `Create component ${validatedName}`,
  }
}

export default createComponent
