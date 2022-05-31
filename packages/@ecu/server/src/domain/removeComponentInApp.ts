import { SourceFile } from 'ts-morph'

import traverseHierarchyTree, { HierarchyResolverType } from './traverseHierarchyTree'
import { getAppSourceAndHierarchy, saveAppSource } from './helpers'

async function removeComponentInApp(index: string) {
  const { AppSource, EcuTag } = getAppSourceAndHierarchy()

  console.log('\n---\n')
  console.log(AppSource.getText())
  console.log('\n---\n')
  // insertImportStatement(AppSource, name)

  // const resolver: HierarchyResolverType = (node, componentName, placement) => {
  //   switch (placement) {
  //     case 'before': {
  //       node.replaceWithText(`<${name} />\n<${componentName} />`)
  //       break
  //     }
  //     case 'after': {
  //       node.replaceWithText(`<${componentName} />\n<${name} />`)
  //       break
  //     }
  //     case 'within': {
  //       node.replaceWithText(`<${componentName}>\n<${name} />`)
  //       break
  //     }
  //     case 'within-expand': {
  //       node.replaceWithText(`<${componentName}>\n<${name} />\n</${componentName}>`)
  //       break
  //     }
  //   }
  // }

  // traverseHierarchyTree(EcuTag, resolver, index)

  console.log('\n---\n')
  console.log(AppSource.getText())
  console.log('\n---\n')

  // await saveAppSource(AppSource)
}

// async function insertImportStatement(AppSource: SourceFile, name: string) {
//   for (const xImport of AppSource.getImportDeclarations()) {
//     const names = [xImport.getDefaultImport(), ...xImport.getNamedImports()]
//       .filter(x => x)
//       .map(x => x.getText())

//     if (names.indexOf(name) !== -1) {
//       return
//     }
//   }

//   const comments = AppSource.getStatementsWithComments()

//   if (comments.length === 0) {
//     throw new Error('No ecu comments found in App.tsx')
//   }

//   comments.forEach(comment => {
//     if (comment.getText().includes('ecu-imports')) {
//       AppSource.insertImportDeclaration(comment.getChildIndex() + 1, {
//         defaultImport: name,
//         moduleSpecifier: `./components/${name}`,
//       })
//     }
//   })
// }

removeComponentInApp('0.1')

export default removeComponentInApp
