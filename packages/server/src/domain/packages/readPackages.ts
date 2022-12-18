import fs from 'node:fs'
import path from 'node:path'

import { appPath } from '../../configuration.js'
import { PackageType } from '../../types.js'

function readPackages() {
  try {
    const packageJson = fs.readFileSync(path.join(appPath, 'package.json'), 'utf8')
    const packageJsonContent = JSON.parse(packageJson)

    const packages: PackageType[] = []

    Object.entries((packageJsonContent.dependencies || {}) as Record<string, string>).forEach(([name, version]) => {
      packages.push({
        name,
        version,
        type: 'dependencies',
      })
    })
    Object.entries((packageJsonContent.devDependencies || {}) as Record<string, string>).forEach(([name, version]) => {
      packages.push({
        name,
        version,
        type: 'devDependencies',
      })
    })

    return packages
  }
  catch (error) {
    console.error(error)

    throw new Error('Error reading package.json')
  }
}

export default readPackages
