import fs from 'fs'
import path from 'path'

import configuration from '../configuration'

import insertComponentInApp from '../domain/insertComponentInApp'

type AddComponentArgumentsType = {
  name: string
}

const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

async function addComponent(parent: any, { name }: AddComponentArgumentsType) {
  if (!fs.existsSync(path.join(componentsLocation, `${name}.tsx`))) {
    throw new Error('Component does not exists')
  }

  await insertComponentInApp(name, '0.0')

  return {
    id: 'noid',
  }
}

export default addComponent
