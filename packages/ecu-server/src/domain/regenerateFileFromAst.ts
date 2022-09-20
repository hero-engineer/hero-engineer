import generate from '@babel/generator'
import { Node } from '@babel/types'

function regenerateFileFromAst(ast: Node) {
  return generate(ast).code
}

export default regenerateFileFromAst
