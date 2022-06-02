import fs from 'fs'
import path from 'path'

import { ComponentType } from '../../types'

import configuration from '../configuration'

import appFile from '../constants/appFile'
import appComponent from '../constants/appComponent'

import moveComponentInHierarchy from '../domain/moveComponentInHierarchy'
import { lintFile } from '../domain/helpers'

type DragComponentArgumentsType = {
  name: string
  sourceIndex: string
  targetIndex: string
  position: 'before' | 'after'
}

function dragComponent(parent: any, { name, sourceIndex, targetIndex, position }: DragComponentArgumentsType) {
  if (!fs.existsSync(path.join(configuration.componentsLocation, `${name}.tsx`))) {
    throw new Error('Component does not exists')
  }

  const component: ComponentType = {
    name,
    props: {},
    importName: name,
    importPath: `/components/${name}`,
    importType: 'default',
  }

  moveComponentInHierarchy(appFile, appComponent, component, sourceIndex, targetIndex, position)
  lintFile(appFile)

  return component
}

export default dragComponent
