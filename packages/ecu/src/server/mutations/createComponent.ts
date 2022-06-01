import fs from 'fs'
import path from 'path'

import { ComponentType } from '../../types'

import configuration from '../configuration'

import template from '../templates/Component.tsx.template'

type CreateComponentArgumentsType = {
  name: string
}

function createComponent(parent: any, { name }: CreateComponentArgumentsType): ComponentType {
  const fileName = `${name}.tsx`

  fs.readdirSync(configuration.componentsLocation).forEach(file => {
    if (file === fileName) {
      throw new Error(`Component ${name} already exists`)
    }
  })

  const content = template(name)
  const componentLocation = path.join(configuration.componentsLocation, `${name}.tsx`)

  fs.writeFileSync(componentLocation, content, 'utf8')

  return {
    name,
    props: {},
    importName: name,
    importPath: `/components/${name}`,
    importType: 'default',
  }
}

export default createComponent
