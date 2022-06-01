import fs from 'fs'
import path from 'path'

import configuration from '../configuration'

import insertComponentInHierarchy from '../domain/insertComponentInHierarchy'

type AddComponentArgumentsType = {
  name: string
  index: string
  position: 'before' | 'after'
}

const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

async function addComponent(parent: any, { name, index, position }: AddComponentArgumentsType) {
  if (!fs.existsSync(path.join(componentsLocation, `${name}.tsx`))) {
    throw new Error('Component does not exists')
  }

  await insertComponentInHierarchy('App', 'App', `components/${name}`, name, index, position)

  return {
    id: 'noid',
  }
}

export default addComponent
