import { Project, ts } from 'ts-morph'

import { FileType } from '~types'

import createDeferedPromise from '~utils/createDeferredPromise'

/* --
  * PROJECT
-- */

const project = new Project({
  useInMemoryFileSystem: true,
  skipAddingFilesFromTsConfig: true,
  compilerOptions: {
    target: ts.ScriptTarget.ESNext,
  },
})

export const projectReady = createDeferedPromise<void>()

const allowedTypescriptExtensions = ['js', 'jsx', 'ts', 'tsx']

export function addTypescriptSourceFiles(files: FileType[], shouldLog = false) {
  const consoleLog = shouldLog ? console.log : () => {}

  const start = Date.now()

  files.forEach(({ path, code }) => {
    if (!allowedTypescriptExtensions.some(extension => path.endsWith(extension))) return

    project.createSourceFile(path, code, { overwrite: true })
  })

  project.resolveSourceFileDependencies()

  consoleLog('typescript', project.getSourceFiles().length, Date.now() - start)

  projectReady.resolve()
}

export default project
