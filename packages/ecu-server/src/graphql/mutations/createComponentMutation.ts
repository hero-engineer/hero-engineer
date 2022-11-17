import fs from 'node:fs'
import path from 'node:path'

import { FileNodeType, FunctionNodeType, HistoryMutationReturnType } from '../../types.js'
import { appPath } from '../../configuration.js'

import createComponentTemplate from '../../templates/Component.js'

import composeHistoryMutation from '../../history/composeHistoryMutation.js'

import { getNodesByFirstNeighbourg } from '../../graph/index.js'
import addFile from '../../graph/add/addFile.js'
import addFileDependencies from '../../graph/add/addFileDependencies.js'

import updateDataEcuAttributes from '../../domain/components/updateDataEcuAttributes.js'
import regenerate from '../../domain/regenerate.js'

import capitalize from '../../utils/capitalize.js'

type CreateComponentMutationArgs = {
  name: string
}

type CreateComponentMutationReturnType = {
  component: FunctionNodeType
  file: FileNodeType
}

async function createComponentMutation(_: any, { name }: CreateComponentMutationArgs): Promise<HistoryMutationReturnType<CreateComponentMutationReturnType>> {
  if (!name) {
    throw new Error('Component name is required')
  }

  const validatedName = capitalize(name)
  const code = createComponentTemplate(validatedName)
  const componentsPath = path.join(appPath, 'src', 'components')

  if (!fs.existsSync(componentsPath)) {
    fs.mkdirSync(componentsPath)
  }

  const filePath = path.join(componentsPath, `${validatedName}.tsx`)

  fs.writeFileSync(filePath, code, 'utf8')

  const fileNode = addFile(filePath)

  addFileDependencies(fileNode)

  const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(fileNode.address, 'DeclaresFunction')[0]

  const ast = updateDataEcuAttributes(componentNode, fileNode.payload.ast)

  await regenerate(fileNode, ast)

  return {
    returnValue: {
      component: componentNode,
      file: fileNode,
    },
    description: `Create component ${validatedName}`,
  }
}

export default composeHistoryMutation(createComponentMutation)
