import Postcss from 'postcss'
import PosscssNested from 'postcss-nested'
import { Project, ts } from 'ts-morph'
// import path from 'path-browserify'

import { FileType, HierarchiesType, HierarchyType } from '~types'

// TODO move processors js files to the server and load then async
// What about types?

// Babel.registerPlugin('jsx', babelPluginJsx)

const project = new Project({
  useInMemoryFileSystem: true,
  skipAddingFilesFromTsConfig: true,
  tsConfigFilePath: '/Users/sven/dev/ecu-app/app/tsconfig.json',
  compilerOptions: {
    target: ts.ScriptTarget.ESNext,
  },
})

// project.resolveSourceFileDependencies();

export const postcss = Postcss([PosscssNested])

export const allowedCssExtensions = ['css']

export const allowedTypescriptExtensions = ['js', 'jsx', 'ts', 'tsx']

export function addTypescriptSourceFiles(files: FileType[]) {
  files.forEach(({ path, code }) => {
    if (!allowedTypescriptExtensions.some(extension => path.endsWith(extension))) return

    project.createSourceFile(path, code, { overwrite: true })
  })

  project.resolveSourceFileDependencies()

  console.log('typescript', project.getSourceFiles().length)
}

export function createHierarchy(filePath: string, componentElements: HTMLElement[]) {
  return {}
}
// const allowedFunctionComponentFirstCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// type ImportType = {
//   type: 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier' | 'ImportSpecifier'
//   source: string
//   name: string
// }

// type ExportType = {
//   type: 'ExportNamedDeclaration' | 'ExportDefaultDeclaration'
//   name: string
// }

// export function createHierarchies(asts: AstsType, filePath: string, componentElements: HTMLElement[], hierarchies: HierarchiesType = {}) {
//   if (!asts[filePath]?.ast) return

//   // Internals
//   const imports: ImportType[] = []
//   const exports: ExportType[] = []

//   function hierarchyImportsPlugin(): PluginObj {
//     return {
//       visitor: {
//         ImportDeclaration(path) {
//           imports.push(...path.node.specifiers.map(specifier => ({
//             source: path.node.source.value,
//             type: specifier.type,
//             name: specifier.local.name,
//           })))
//           path.skip()
//         },
//         ExportNamedDeclaration(path) {
//           exports.push(...path.node.specifiers.map(specifier => ({
//             type: path.node.type,
//             name: specifier.exported.type === 'Identifier' ? specifier.exported.name : specifier.exported.value,
//           })))
//           path.skip()
//         },
//         ExportDefaultDeclaration(path) {
//           exports.push({
//             type: path.node.type,
//             // @ts-expect-error
//             name: path.node.declaration?.id ?? path.node.declaration?.name?.name ?? path.node.declaration?.name ?? '',
//           })
//           path.skip()
//         },
//       },
//     }
//   }

//   function hierarchyPlugin(): PluginObj {
//     return {
//       visitor: {
//         FunctionDeclaration(path) {
//           // Look for Component functions
//           if (!(path.parent.type === 'Program' && path.node.id && allowedFunctionComponentFirstCharacters.includes(path.node.id.name[0]))) return path.skip()

//           const { name } = path.node.id
//           const isDefaultExport = exports.find(e => e.name === name)?.type === 'ExportDefaultDeclaration'

//           const subHierarchy: HierarchyType = {
//             id: `${filePath}#${name}`,
//             name,
//             start: path.node.body.start!,
//             element: null,
//             childrenElements: isDefaultExport ? [...componentElements] : [],
//             childrenElementsStack: isDefaultExport ? [...componentElements] : [],
//             children: [],
//           }

//           hierarchies[subHierarchy.id] = subHierarchy

//           path.traverse(visitFunctionComponent(subHierarchy))
//           path.skip()
//         },
//       },
//     }
//   }

//   function visitFunctionComponent(hierarchy: HierarchyType): Visitor {
//     return {
//       ReturnStatement(path) {
//         // If we're on the return statement of the function
//         if (path.parent.start !== hierarchy.start) return path.skip()

//         const inferred = inferJsx(path, hierarchy)

//         console.log(inferred ? 'ALL INFERRED' : 'INFER ERROR')
//       },
//     }
//   }

//   function inferJsx(rootPath: NodePath, hierarchy: HierarchyType) {
//     console.log('injerJsx', hierarchy.id, hierarchy.childrenElements)

//     let inferred = true

//     const rootStart = rootPath.node.start!

//     rootPath.traverse({
//       JSXFragment(path) {
//         if (path.parent.start !== rootStart) return path.skip()
//         if (!inferJsx(path, hierarchy)) inferred = false
//       },
//       JSXElement(path) {
//         if (path.parent.start !== rootStart) return path.skip()

//         if (path.node.openingElement.name.type === 'JSXIdentifier') {
//           const { name } = path.node.openingElement.name
//           const hierarchyElement = hierarchy.childrenElementsStack[0]

//           if (!hierarchyElement) {
//             inferred = false
//             console.log('--> no more elements to infer against', name)

//             return
//           }

//           if (hierarchyElement.nodeType === Node.TEXT_NODE) {
//             inferred = false
//             console.log('--> non-inferred text against', name)

//             return
//           }

//           const hierarchyTagName = hierarchyElement?.tagName?.toLowerCase()

//           console.log(hierarchy.id, name)

//           if (hierarchyTagName === name) {
//             console.log('--> inferred', hierarchyTagName)

//             const element = hierarchy.childrenElementsStack.shift()!

//             const childrenElements: HTMLElement[] = []

//             for (const child of element.childNodes) {
//               childrenElements.push(child as HTMLElement)
//             }

//             const subHierarchy: HierarchyType = {
//               id: `${hierarchy.id}#${hierarchyTagName}#${hierarchy.childrenElements.indexOf(element)}`,
//               name,
//               start: path.node.start!,
//               element,
//               childrenElements,
//               childrenElementsStack: [...childrenElements],
//               children: [],
//             }

//             if (inferJsx(path, subHierarchy)) hierarchy.children.push(subHierarchy)
//             else inferred = false
//           }
//           else {
//             inferred = false
//             console.log('--> non-inferred', hierarchyTagName, 'against', name)
//           }
//         }
//         if (path.node.openingElement.name.type === 'JSXMemberExpression') {
//           // @ts-expect-error
//           console.log(hierarchy.name, path.node.openingElement.name.object.name)
//         }

//         path.skip()
//       },
//       JSXText(path) {
//         if (!path.node.value.trim()) return
//         if (path.parent.start !== rootStart) return path.skip()

//         const hierarchyElement = hierarchy.childrenElementsStack[0]

//         if (!hierarchyElement) {
//           inferred = false
//           console.log('--> no more elements to infer against text')

//           return
//         }

//         console.log(hierarchy.id, 'jsx text', path.node.value.trim(), 'vs', hierarchyElement.textContent)

//         if (hierarchyElement.nodeType === Node.TEXT_NODE && hierarchyElement.textContent === path.node.value.trim()) {
//           console.log('--> inferred text')

//           const element = hierarchy.childrenElementsStack.shift()!

//           const subHierarchy: HierarchyType = {
//             id: `${hierarchy.id}#text#${hierarchy.childrenElements.indexOf(element)}`,
//             name: 'text',
//             start: path.node.start!,
//             element,
//             childrenElements: [],
//             childrenElementsStack: [],
//             children: [],
//           }

//           hierarchy.children.push(subHierarchy)
//         }
//         else {
//           inferred = false
//           console.log('--> non-inferred text against', hierarchyElement)
//         }
//       },
//       JSXExpressionContainer(path) {
//         if (path.parent.start !== rootStart) return path.skip()
//         if (!inferJsxExpressionContainer(path, hierarchy)) inferred = false
//       },
//     })

//     rootPath.skip()

//     return inferred
//   }

//   function inferJsxExpressionContainer(rootPath: NodePath, hierarchy: HierarchyType) {
//     let inferred = true

//     const rootStart = rootPath.node.start!

//     console.log('inferJsxExpressionContainer', hierarchy.id, hierarchy.childrenElements, rootPath.node)

//     rootPath.traverse({
//       Identifier(path) {
//         if (path.parent.start !== rootStart) return path.skip()

//         const hierarchyElement = hierarchy.childrenElementsStack[0]

//         if (!hierarchyElement) {
//           inferred = false
//           console.log('--> no more elements to infer against Identifier')

//           return
//         }

//         console.log(hierarchy.id, 'Identifier', path.node.name, 'vs', hierarchyElement)

//       },
//       StringLiteral(path) {
//         if (path.parent.start !== rootStart) return path.skip()

//         const hierarchyElement = hierarchy.childrenElementsStack[0]

//         if (!hierarchyElement) {
//           inferred = false
//           console.log('--> no more elements to infer against StringLiteral')

//           return
//         }

//         console.log(hierarchy.id, 'StringLiteral', path.node.value, 'vs', hierarchyElement.textContent)

//         if (hierarchyElement.nodeType === Node.TEXT_NODE && hierarchyElement.textContent === path.node.value) {
//           console.log('--> inferred text')

//           const element = hierarchy.childrenElementsStack.shift()!

//           const subHierarchy: HierarchyType = {
//             id: `${hierarchy.id}#text#${hierarchy.childrenElements.indexOf(element)}`,
//             name: 'text',
//             start: path.node.start!,
//             element,
//             childrenElements: [],
//             childrenElementsStack: [],
//             children: [],
//           }

//           hierarchy.children.push(subHierarchy)
//         }
//         else {
//           inferred = false
//           console.log('--> non-inferred text against StringLiteral', path.node.value)
//         }
//       },
//     })

//     rootPath.skip()

//     return inferred
//   }

//   Babel.registerPlugins({
//     'ecu-hierarchy-imports': hierarchyImportsPlugin,
//     'ecu-hierarchy': hierarchyPlugin,
//   })

//   Babel.transformFromAst(asts[filePath].ast as File, asts[filePath].code, { ...hierarchyBabelOptions, filename: filePath, plugins: ['ecu-hierarchy-imports'] })
//   Babel.transformFromAst(asts[filePath].ast as File, asts[filePath].code, { ...hierarchyBabelOptions, filename: filePath, plugins: ['ecu-hierarchy'] })

//   function isElementsStackEmpty(hierarchy: HierarchyType): boolean {
//     return !hierarchy.childrenElementsStack.length && hierarchy.children.every(isElementsStackEmpty)
//   }

//   if (!Object.values(hierarchies).every(isElementsStackEmpty)) console.log('SOME ELEMENTS WERE NOT RESOLVED')

//   return hierarchies
// }
