import { ExportAssignment, FunctionDeclaration, ImportDeclaration, JsxChild, JsxElement, JsxExpression, JsxFragment, JsxText, Project, SourceFile, StringLiteral, SyntaxKind, ts } from 'ts-morph'
// import path from 'path-browserify'

import { ExportType, FileType, HierarchyType, ImportType } from '~types'

import createDeferedPromise from '~utils/createDeferredPromise'

const project = new Project({
  useInMemoryFileSystem: true,
  skipAddingFilesFromTsConfig: true,
  compilerOptions: {
    target: ts.ScriptTarget.ESNext,
  },
})

// project.resolveSourceFileDependencies();

export const allowedTypescriptExtensions = ['js', 'jsx', 'ts', 'tsx']

const start = Date.now()
const projectReady = createDeferedPromise<void>()

export function addTypescriptSourceFiles(files: FileType[]) {
  files.forEach(({ path, code }) => {
    if (!allowedTypescriptExtensions.some(extension => path.endsWith(extension))) return

    project.createSourceFile(path, code, { overwrite: true })
  })

  project.resolveSourceFileDependencies()

  console.log('typescript', project.getSourceFiles().length, Date.now() - start)

  projectReady.resolve()
}

const allowedFunctionComponentFirstCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export async function createHierarchy(filePath: string, componentElements: HTMLElement[]) {
  await projectReady.promise

  const sourceFile = project.getSourceFile(filePath)

  if (!sourceFile) return {}

  const imports: ImportType[] = []
  const exports: ExportType[] = []

  function traverseImportsAndExports(sourceFile: SourceFile) {
    sourceFile.forEachChild(node => {
      switch (node.getKind()) {
        case SyntaxKind.ImportDeclaration: {
          const importDeclaration = node as ImportDeclaration

          const importClause = importDeclaration.getImportClause()
          const defaultExportName = importClause?.getDefaultImport()?.getText()
          const importSpecifierNames = importClause?.getNamedImports().map(x => x.getText()) ?? []
          const moduleName = importDeclaration.getModuleSpecifier()?.getLiteralText() ?? ''

          if (!moduleName) break

          if (defaultExportName) {
            imports.push({
              type: 'default',
              name: defaultExportName,
              source: moduleName,
            })
          }

          imports.push(...importSpecifierNames.map(namedExportName => ({
            type: 'named' as const,
            name: namedExportName,
            source: moduleName,
          })))

          break
        }
        case SyntaxKind.ExportAssignment: {
          const exportAssignment = node as ExportAssignment
          const defaultExportName = exportAssignment.getExpression()?.getText()

          if (defaultExportName) {
            exports.push({
              type: 'default',
              name: defaultExportName,
            })
          }

          break
        }
      }
    })
  }

  function traverseHierarchy(sourceFile: SourceFile) {
    return sourceFile.forEachChild(node => {
      switch (node.getKind()) {
        case SyntaxKind.FunctionDeclaration: {
          const functionNode = node as FunctionDeclaration

          const functionName = functionNode.getName() ?? ''

          if (!(functionName && allowedFunctionComponentFirstCharacters.includes(functionName[0]))) break

          const isDefaultExport = exports.find(e => e.name === functionName)?.type === 'default'

          if (!isDefaultExport) break // For now

          const hierarchy: HierarchyType = {
            id: `${filePath}#${functionName}`,
            name: functionName,
            start: node.getStart(),
            element: null,
            childrenElements: [...componentElements],
            childrenElementsStack: [...componentElements],
            children: [],
          }

          visitFunctionComponent(functionNode, hierarchy)

          return hierarchy
        }
      }
    })
  }

  function visitFunctionComponent(functionNode: FunctionDeclaration, hierarchy: HierarchyType) {
    const topJsxElements = functionNode.getBody()?.getDescendantsOfKind(SyntaxKind.JsxElement).filter(jsxElement => {
      const parentKind = jsxElement.getParent().getKind()

      return parentKind !== SyntaxKind.JsxElement && parentKind !== SyntaxKind.JsxFragment
    }) ?? []

    const topJsxFragments = functionNode.getBody()?.getDescendantsOfKind(SyntaxKind.JsxFragment).filter(jsxFragment => {
      const parentKind = jsxFragment.getParent().getKind()

      return parentKind !== SyntaxKind.JsxElement && parentKind !== SyntaxKind.JsxFragment
    }) ?? []

    inferJsxs(hierarchy, [...topJsxElements, ...topJsxFragments])
  }

  function inferJsxs(hierarchy: HierarchyType, jsxs: JsxChild[]) {
    console.log('inferJsxs start', hierarchy.id, jsxs.length)

    const result = jsxs.map(jsx => {
      console.log('---')

      const hierarchyClone = cloneHierarchy(hierarchy)

      return {
        inferred: inferJsx(hierarchyClone, jsx),
        hierarchy: hierarchyClone,
      }
    })
    .filter(x => x.inferred)
    .map(x => ({
      hierarchy: x.hierarchy,
      stackCount: hierarchyStackCount(x.hierarchy),
    }))
    .reduce<{ hierarchy: HierarchyType | null, stackCount: number}>((a, b) => a.stackCount < b.stackCount ? a : b, { hierarchy: null, stackCount: Infinity })

    console.log('inferJsxs end', result.stackCount, result.hierarchy)

    if (result.hierarchy) Object.assign(hierarchy, result.hierarchy)
  }

  function inferJsx(hierarchy: HierarchyType, jsx: JsxChild): boolean {
    const jsxKind = jsx.getKind()

    if (jsxKind === SyntaxKind.JsxElement) {
      const jsxElement = jsx as JsxElement
      const jsxTagName = jsxElement.getOpeningElement().getTagNameNode().getText()
      const element = hierarchy.childrenElementsStack[0]

      console.log('--> inferring', jsxTagName, 'against', element)

      if (!element || element.nodeType === Node.TEXT_NODE) {
        console.log('<-- ...')

        return false
      }

      const elementTagName = element.tagName.toLowerCase()

      if (jsxTagName !== elementTagName) {
        console.log('<-- ...')

        return false
      }

      console.log('<-- !!!')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)
      const childrenElements: HTMLElement[] = []

      for (const child of element.childNodes) {
        childrenElements.push(child as HTMLElement)
      }

      const subHierarchy: HierarchyType = {
        id: `${hierarchy.id}#${jsxTagName}[${indexOfStackElement}]`,
        name: jsxTagName,
        start: jsxElement.getStart(),
        element: stackElement,
        childrenElements,
        childrenElementsStack: [...childrenElements],
        children: [],
      }

      const results = jsxElement.getJsxChildren().map(jsxChild => inferJsx(subHierarchy, jsxChild))

      if (results.every(x => x)) {
        hierarchy.children.push(subHierarchy)

        return true
      }

      return false
    }

    if (jsxKind === SyntaxKind.JsxFragment) {
      console.log('--> inferring fragment')

      const jsxFragment = jsx as JsxFragment
      const results = jsxFragment.getJsxChildren().map(jsxChild => inferJsx(hierarchy, jsxChild))

      return results.every(x => x)
    }

    if (jsxKind === SyntaxKind.JsxText) {
      const jsxText = jsx as JsxText
      const jsxTextValue = jsxText.getLiteralText().trim()

      if (!jsxTextValue) return true

      const element = hierarchy.childrenElementsStack[0]

      console.log('--> inferring jsxText', jsxTextValue, 'against', element)

      if (!element || element.nodeType !== Node.TEXT_NODE || element.textContent?.trim() !== jsxTextValue) {
        console.log('<-- ...')

        return false
      }

      console.log('<-- !!!')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

      const subHierarchy: HierarchyType = {
        id: `${hierarchy.id}#text[${indexOfStackElement}]`,
        name: 'text',
        start: jsx.getStart(),
        element: stackElement,
        childrenElements: [],
        childrenElementsStack: [],
        children: [],
      }

      hierarchy.children.push(subHierarchy)

      return true
    }

    if (jsxKind === SyntaxKind.JsxExpression) {
      const jsxExpression = jsx as JsxExpression
      const expression = jsxExpression.getExpression()

      if (!expression) return true

      const element = hierarchy.childrenElementsStack[0]

      console.log('--> inferring jsxExpression', jsxExpression.getText(), 'against', element)

      if (!element) {
        console.log('<-- ...')

        return false
      }

      if (expression.getKind() === SyntaxKind.StringLiteral) {
        const stringLiteral = expression as StringLiteral
        const stringLiteralTextValue = stringLiteral.getLiteralText()

        if (element.nodeType !== Node.TEXT_NODE || element.textContent !== stringLiteralTextValue) {
          console.log('<-- ...')

          return false
        }

        console.log('<-- !!!')

        const stackElement = hierarchy.childrenElementsStack.shift()!
        const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

        const subHierarchy: HierarchyType = {
          id: `${hierarchy.id}#text[${indexOfStackElement}]`,
          name: 'text',
          start: jsx.getStart(),
          element: stackElement,
          childrenElements: [],
          childrenElementsStack: [],
          children: [],
        }

        hierarchy.children.push(subHierarchy)

        return true
      }

      console.log('--> NON INFERRED jsxExpression', expression.getKindName())

      return false
    }

    console.log('--> NON INFERRED', jsx.getKindName())

    return false
  }

  console.log('__TRAVERSAL_START__')

  const startTime = Date.now()

  traverseImportsAndExports(sourceFile)

  const hierarchy = traverseHierarchy(sourceFile)

  console.log('__TRAVERSAL_END__', Date.now() - startTime)

  // console.log('imports', imports)
  // console.log('exports', exports)

  return hierarchy ?? null
}

function cloneHierarchy(hierarchy: HierarchyType): HierarchyType {
  return {
    ...hierarchy,
    childrenElementsStack: [...hierarchy.childrenElementsStack],
    children: hierarchy.children.map(cloneHierarchy),
  }
}

function hierarchyStackCount(hierarchy: HierarchyType): number {
  return hierarchy.childrenElementsStack.length + hierarchy.children.map(hierarchyStackCount).reduce((sum, count) => sum + count, 0)
}
