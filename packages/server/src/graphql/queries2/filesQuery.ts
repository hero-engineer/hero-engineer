import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

import { FileType } from '../../types.js'
import { appPath } from '../../configuration.js'

function filesQuery() {
  // const files: FileType[] = []
  // const srcPath = path.join(appPath, 'src')

  // function readDirectory(location: string,) {
  //   fs.readdirSync(location).forEach(fileName => {
  //     const filePath = path.join(location, fileName)

  //     if (fs.statSync(filePath).isDirectory()) {
  //       return readDirectory(filePath)
  //     }

  //     files.push({
  //       path: filePath,
  //       code: fs.readFileSync(filePath, 'utf8'),
  //     })
  //   })
  // }

  // readDirectory(srcPath)

  const files: FileType[] = []
  const srcPath = path.join(appPath, 'src')
  const nodeModulesPath = path.join(appPath, 'node_modules')

  function readDirectory(location: string, isNodeModules = false) {
    fs.readdirSync(location).forEach(fileName => {
      const filePath = path.join(location, fileName)

      if (fs.statSync(filePath).isDirectory()) {
        return readDirectory(filePath, isNodeModules)
      }

      if (isNodeModules && !filePath.endsWith('.d.ts')) return

      files.push({
        path: filePath,
        code: fs.readFileSync(filePath, 'utf8'),
      })
    })
  }

  function traverseDependencies(dependencies: string[]) {
    dependencies.forEach(packageName => {
      try {
        readDirectory(path.join(nodeModulesPath, packageName), true)
      }
      catch {
        console.log(packageName)
      }
    })
  }

  readDirectory(srcPath)

  traverseDependencies([
    '@types/react',
    '@types/react-dom',
  ])

  return files
}

// function listDependencies() {
//   const result = execSync('npm ls --all --json --omit dev', { cwd: appPath })

//   return JSON.parse(result.toString())
// }

export default filesQuery
