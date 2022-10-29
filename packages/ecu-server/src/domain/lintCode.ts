import { ESLint } from 'eslint'

async function lintCode(code: string) {
  const results = await new ESLint({ fix: true }).lintText(code)

  return results[0]?.output || code
}

export default lintCode
