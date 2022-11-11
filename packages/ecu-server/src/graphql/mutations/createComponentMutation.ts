import fs from 'node:fs'
import path from 'node:path'

import { FunctionNodeType, HistoryMutationReturnType } from '../../types'
import { appPath } from '../../configuration'

import createComponentTemplate from '../../templates/Component'

import composeHistoryMutation from '../../history/composeHistoryMutation'

import { getNodesByFirstNeighbourg } from '../../graph'
import addFile from '../../graph/add/addFile'
import addFileDependencies from '../../graph/add/addFileDependencies'

import updateDataEcuAttributes from '../../domain/traversal/updateDataEcuAttributes'
import regenerate from '../../domain/regenerate'

import capitalize from '../../utils/capitalize'

type CreateComponentMutationArgs = {
  name: string
}

async function createComponentMutation(_: any, { name }: CreateComponentMutationArgs): Promise<HistoryMutationReturnType<FunctionNodeType | null>> {
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

  const ast = updateDataEcuAttributes(componentNode, fileNode.payload.ast)

  await regenerate(fileNode, ast)

  return {
    returnValue: componentNode,
    impactedFileNodes: [fileNode],
    description: `Create component ${validatedName}`,
  }
}

export default composeHistoryMutation(createComponentMutation)
