import fs from 'node:fs'
import path from 'node:path'

import { appPath, commonDecoratorName, decoratorNameSuffix, decoratorsRelativePath } from '../../configuration.js'

import possiblyAddExtension from '../../utils/possiblyAddExtension.js'

function getComponentDecoratorPaths(componentPath: string) {
  const decoratorsLocation = path.join(appPath, decoratorsRelativePath)

  const decorators: string[] = [
    path.join(decoratorsLocation, possiblyAddExtension(commonDecoratorName, 'tsx')),
  ]

  const componentName = path.basename(componentPath)
  const files = fs.readdirSync(decoratorsLocation)

  files.forEach(file => {
    const fileName = path.basename(file, path.extname(file))
    const decoratorName = componentName + decoratorNameSuffix

    if (fileName === decoratorName) {
      decorators.push(path.join(decoratorsLocation, possiblyAddExtension(decoratorName, 'tsx')))
    }
  })

  return decorators
}

export default getComponentDecoratorPaths
