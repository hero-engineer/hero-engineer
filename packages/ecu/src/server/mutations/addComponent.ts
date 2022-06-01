import fs from 'fs'
import path from 'path'

import { ComponentType } from '../../types'

import configuration from '../configuration'

import appFile from '../constants/appFile'
import appComponent from '../constants/appComponent'

import insertComponentInHierarchy from '../domain/insertComponentInHierarchy'
import { lintFile } from '../domain/helpers'

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

  const component: ComponentType = {
    name,
    props: {},
    importName: name,
    importPath: `/components/${name}`,
    importType: 'default',
  }

  insertComponentInHierarchy(appFile, appComponent, component, index, position)
  lintFile(appFile)

  return component
}

export default addComponent
