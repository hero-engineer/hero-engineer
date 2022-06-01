import fs from 'fs'
import path from 'path'

import { ComponentType } from '../../types'

import configuration from '../configuration'

import template from '../templates/Component.tsx.template'

type CreateComponentArgumentsType = {
  name: string
}

const componentsLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/components')

function createComponent(parent: any, { name }: CreateComponentArgumentsType): ComponentType {
  const fileName = `${name}.tsx`

  fs.readdirSync(componentsLocation).forEach(file => {
    if (file === fileName) {
      throw new Error(`Component ${name} already exists`)
    }
  })

  const content = template(name)
  const componentLocation = path.join(componentsLocation, `${name}.tsx`)

  fs.writeFileSync(componentLocation, content, 'utf8')

  return {
    id: name,
    name,
  }
}

export default createComponent
