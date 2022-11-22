import path from 'node:path'

import ncu from 'npm-check-updates'

import { appPath } from '../configuration.js'
import { PackageType } from '../types.js'

async function readPackagesUpdates() {
  const packageJsonLocation = path.join(appPath, 'package.json')

  // @ts-expect-error
  const updatable = await ncu.default({
    packageFile: packageJsonLocation,
    upgrade: false,
  }) as Record<string, string>

  const packages: PackageType[] = []

  Object.entries(updatable).forEach(([name, version]) => {
    packages.push({
      name,
      version,
      type: 'dependencies', // Does not dinstinguish between dev and dependencies
    })
  })

  return packages
}

export default readPackagesUpdates
