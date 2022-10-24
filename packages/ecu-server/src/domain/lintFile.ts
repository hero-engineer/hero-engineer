import { ESLint } from 'eslint'

async function lintFile(filePath: string) {
  const eslint = new ESLint({ fix: true })
  const results = await eslint.lintFiles(filePath)

  ESLint.outputFixes(results)
}

export default lintFile
