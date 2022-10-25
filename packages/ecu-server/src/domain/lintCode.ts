import { ESLint } from 'eslint'

async function lintCode(text: string) {
  const results = await new ESLint({ fix: true }).lintText(text)

  return results[0].output || text
}

export default lintCode
