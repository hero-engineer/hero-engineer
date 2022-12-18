import fs from 'node:fs'
import path from 'node:path'

import { appPath, ecuCommonDecoratorName, ecuDecoratorNameSuffix, ecuDecoratorsRelativePath } from '../../configuration.js'

import possiblyAddExtension from '../../utils/possiblyAddExtension.js'

function getComponentDecoratorPaths(componentPath: string) {
  const decoratorsLocation = path.join(appPath, ecuDecoratorsRelativePath)

  const decorators: string[] = [
    path.join(decoratorsLocation, possiblyAddExtension(ecuCommonDecoratorName, 'tsx')),
  ]

  const componentName = path.basename(componentPath)
  const files = fs.readdirSync(decoratorsLocation)

  files.forEach(file => {
    const fileName = path.basename(file, path.extname(file))
    const decoratorName = componentName + ecuDecoratorNameSuffix

    if (fileName === decoratorName) {
      decorators.push(path.join(decoratorsLocation, possiblyAddExtension(decoratorName, 'tsx')))
    }
  })

  return decorators
}

export default getComponentDecoratorPaths
