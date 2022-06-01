import fs from 'fs'
import path from 'path'

import { ComponentType, SceneType } from '../../types'

import appFile from '../constants/appFile'
import appComponent from '../constants/appComponent'
import ecuComponent from '../constants/ecuComponent'
import routerComponent from '../constants/routerComponent'

import configuration from '../configuration'
import insertComponentInHierarchy from '../domain/insertComponentInHierarchy'
import { lintFile } from '../domain/helpers'

import template from '../templates/Scene.tsx.template'

type CreateSceneArgumentsType = {
  name: string
  url: string
}

function createScene(parent: any, { name, url }: CreateSceneArgumentsType): SceneType {
  const fileName = `${name}.tsx`

  fs.readdirSync(configuration.scenesLocation).forEach(file => {
    if (file === fileName) {
      throw new Error(`Scene ${name} already exists`)
    }
  })

  const content = template(name)
  const sceneLocation = path.join(configuration.scenesLocation, `${name}.tsx`)

  fs.writeFileSync(sceneLocation, content, 'utf8')

  const sceneComponent: ComponentType = {
    name,
    props: {},
    importName: name,
    importPath: `/scenes/${name}`,
    importType: 'default',
  }

  // TODO app route in App.jsx
  if (!hasDirectChild(appFile, appComponent, ecuComponent, routerComponent)) {
    insertComponentInHierarchy(appFile, appComponent, routerComponent, '0.0', 'before')
    insertComponentInHierarchy(appFile, appComponent, routesComponent, '0.0.0', 'before')
  }

  const nChildren = countChildren(appFile, appComponent, '0.0')

  const routeComponent: ComponentType = {
    name: 'Route',
    importName: 'Route',
    importPath: 'react-router-dom',
    importType: 'named',
    props: {
      exact: 'true',
      path: '"url"',
      element: `<${name} />`,
    },
  }

  insertComponentInHierarchy(appFile, appComponent, routeComponent, `0.0.0.${Math.max(0, nChildren - 1)}`, 'after')

  lintFile(appFile)

  return {
    name,
    url,
  }
}

export default createScene
