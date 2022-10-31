import { ESLint } from 'eslint'

const eslint = new ESLint({ fix: true })

async function lintCode(code: string) {
  const results = await eslint.lintText(code)

  return results[0]?.output || code
}

export default lintCode
