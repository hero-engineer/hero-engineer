import fs from 'fs'
import path from 'path'

import { SceneType } from '../../types'

import configuration from '../configuration'

import template from '../templates/Scene.tsx.template'

type CreateSceneArgumentsType = {
  name: string
}

const scenesLocation = path.join(configuration.rootPath, configuration.appRoot, 'src/scenes')

function createScene(parent: any, { name }: CreateSceneArgumentsType): SceneType {
  const fileName = `${name}.tsx`

  fs.readdirSync(scenesLocation).forEach(file => {
    if (file === fileName) {
      throw new Error(`Scene ${name} already exists`)
    }
  })

  const content = template(name)
  const sceneLocation = path.join(scenesLocation, `${name}.tsx`)

  fs.writeFileSync(sceneLocation, content, 'utf8')

  return {
    id: name,
    name,
  }
}

export default createScene
