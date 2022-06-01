import fs from 'fs'
import path from 'path'

import configuration from '../configuration'

import moveComponentInHierarchy from '../domain/moveComponentInHierarchy'

type DragComponentArgumentsType = {
  name: string
  sourceIndex: string
  targetIndex: string
  position: 'before' | 'after'
}

const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

async function dragComponent(parent: any, { name, sourceIndex, targetIndex, position }: DragComponentArgumentsType) {
  if (!fs.existsSync(path.join(componentsLocation, `${name}.tsx`))) {
    throw new Error('Component does not exists')
  }

  await moveComponentInHierarchy('App', 'App', `components/${name}`, name, sourceIndex, targetIndex, position)

  return {
    id: 'noid',
  }
}

export default dragComponent
