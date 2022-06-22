import fs from 'fs'
import path from 'path'

import configuration from '../../shared/configuration'
import graph from '../graph'
import { getNodeByAddress } from '../../shared/graphHelpers'
import addFile from '../graph/add/addFile'

import template from '../templates/Component.tsx.template'

type CreateComponentArgumentsType = {
  name: string
}

function createComponent(parent: any, { name }: CreateComponentArgumentsType) {
  const fileName = `${name}.tsx`

  // TODO custom location
  fs.readdirSync(configuration.componentsPath).forEach(file => {
    if (file === fileName) {
      throw new Error(`Component ${name} already exists`)
    }
  })

  const content = template(name)
  const filePath = path.join(configuration.componentsPath, `${name}.tsx`)

  fs.writeFileSync(filePath, content, 'utf8')

  const fileNode = addFile(graph, filePath)

  return getNodeByAddress(graph, `Function:::${fileNode.path}:::${name}`)
}

export default createComponent
