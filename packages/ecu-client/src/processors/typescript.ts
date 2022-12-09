import {
  ExportAssignment,
  FunctionDeclaration,
  Identifier,
  ImportDeclaration,
  JsxChild,
  JsxElement,
  JsxExpression,
  JsxFragment,
  JsxSelfClosingElement,
  JsxText,
  Project,
  SourceFile,
  StringLiteral,
  SyntaxKind,
  ts,
} from 'ts-morph'
// import path from 'path-browserify'

import {
  ExpandedHierarchyType,
  ExportType,
  FileType,
  HierarchyType,
  ImportType,
} from '~types'

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

const start = Date.now()
const projectReady = createDeferedPromise<void>()
const allowedTypescriptExtensions = ['js', 'jsx', 'ts', 'tsx']

export function addTypescriptSourceFiles(files: FileType[]) {
  files.forEach(({ path, code }) => {
    if (!allowedTypescriptExtensions.some(extension => path.endsWith(extension))) return

    project.createSourceFile(path, code, { overwrite: true })
  })

  project.resolveSourceFileDependencies()

  console.log('typescript', project.getSourceFiles().length, Date.now() - start)

  projectReady.resolve()
}

/* --
  * HIERARCHY
-- */

const allowedFunctionComponentFirstCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export async function createHierarchy(filePath: string, componentElements: HTMLElement[]) {
  await projectReady.promise

  const hierarchy = createHierarchySync(filePath, componentElements)

  return hierarchy ? cleanHierarchy(hierarchy) : null
}

function createHierarchySync(filePath: string, componentElements: HTMLElement[]) {
  const sourceFile = project.getSourceFile(filePath)

  if (!sourceFile) return null

  const imports: ImportType[] = []
  const exports: ExportType[] = []

  /* --
    * IMPORTS/EXPORTS TRAVERSAL
  -- */

  function traverseImportsAndExports(sourceFile: SourceFile) {
    sourceFile.forEachChild(node => {
      switch (node.getKind()) {
        case SyntaxKind.ImportDeclaration: {
          const importDeclaration = node as ImportDeclaration

          const importClause = importDeclaration.getImportClause()
          const defaultExportName = importClause?.getDefaultImport()?.getText()
          const importSpecifierNames = importClause?.getNamedImports().map(x => x.getText()) ?? []
          const moduleName = importDeclaration.getModuleSpecifier().getLiteralText() ?? ''
          const sourceFilePath = importDeclaration.getModuleSpecifierSourceFile()?.getFilePath() ?? ''

          if (!moduleName) break

          if (defaultExportName) {
            imports.push({
              type: 'default',
              name: defaultExportName,
              source: moduleName,
              sourceFilePath,
            })
          }

          imports.push(...importSpecifierNames.map(namedExportName => ({
            type: 'named' as const,
            name: namedExportName,
            source: moduleName,
            sourceFilePath,
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

  /* --
    * HIERARCHY TRAVERSAL
  -- */

  function traverseHierarchy(sourceFile: SourceFile) {
    return sourceFile.forEachChild(node => {
      switch (node.getKind()) {
        case SyntaxKind.FunctionDeclaration: {
          const functionNode = node as FunctionDeclaration

          const functionName = functionNode.getName() ?? ''

          if (!(functionName && allowedFunctionComponentFirstCharacters.includes(functionName[0]))) break

          const isDefaultExport = exports.find(e => e.name === functionName)?.type === 'default'

          if (!isDefaultExport) break // For now

          const hierarchy: ExpandedHierarchyType = {
            id: `${filePath}#${functionName}`,
            name: functionName,
            start: node.getStart(),
            element: null,
            childrenElements: [...componentElements],
            childrenElementsStack: [...componentElements],
            children: [],
            context: {
              sourceFile,
            },
          }

          visitFunctionComponent(functionNode, hierarchy)

          return hierarchy
        }
      }
    })
  }

  function visitFunctionComponent(functionNode: FunctionDeclaration, hierarchy: ExpandedHierarchyType) {
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

  /* --
    * INFER JSXS
  -- */

  function inferJsxs(hierarchy: ExpandedHierarchyType, jsxs: JsxChild[]) {
    console.log('inferJsxs start,', jsxs.length, 'children on', hierarchy.id)

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
      stackCount: countHierarchyStack(x.hierarchy),
    }))
    .reduce<{ hierarchy: ExpandedHierarchyType | null, stackCount: number}>((a, b) => a.stackCount < b.stackCount ? a : b, { hierarchy: null, stackCount: Infinity })

    console.log('inferJsxs end, stack count is', result.stackCount, 'hierarchy:', result.hierarchy)

    if (result.hierarchy) Object.assign(hierarchy, result.hierarchy)
  }

  /* --
    * INFER JSX
  -- */

  function inferJsx(hierarchy: ExpandedHierarchyType, jsx: JsxChild): boolean {
    const jsxKind = jsx.getKind()

    /* --
      * JsxElement
    -- */
    if (jsxKind === SyntaxKind.JsxElement || jsxKind === SyntaxKind.JsxSelfClosingElement) {
      const jsxElement = jsx as JsxElement | JsxSelfClosingElement
      const jsxTagName = ((jsxElement as JsxElement).getOpeningElement?.() ?? jsxElement as JsxSelfClosingElement).getTagNameNode().getText()
      const element = hierarchy.childrenElementsStack[0]

      console.log('--> inferring', jsxTagName, 'against', element)

      // If a capitalized tag is found it means its a component
      if (jsxTagName[0] === jsxTagName[0].toUpperCase()) {
        const foundImport = imports.find(x => x.name === jsxTagName)

        if (!foundImport) {
          console.log('<-- ... (no corresponding import was found)')

          return false
        }

        const { sourceFilePath } = foundImport

        if (!sourceFilePath || sourceFilePath.includes('/node_modules/')) {
          console.log('<-- ... (import is node_modules)')

          return false
        }

        console.log('----> found', foundImport.name)

        const subHierarchy = createHierarchySync(sourceFilePath, hierarchy.childrenElementsStack)

        if (!subHierarchy) {
          console.log('<----- ... (no hierarchy was created)')

          return false
        }

        console.log('<----- !!!')

        hierarchy.children.push(subHierarchy)

        // Remove inserted elements from hierarchy stack
        getHierarchyRootElements(subHierarchy).forEach(unstackedElement => {
          const index = hierarchy.childrenElementsStack.indexOf(unstackedElement)

          if (index === -1) return

          hierarchy.childrenElementsStack.splice(index, 1)
        })

        return true
      }

      if (!element || element.nodeType === Node.TEXT_NODE) {
        console.log('<-- ...')

        return false
      }

      const elementTagName = element.tagName.toLowerCase()

      if (jsxTagName !== elementTagName) {
        console.log('<-- ...')

        return false
      }

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)
      const childrenElements: HTMLElement[] = []

      for (const child of element.childNodes) {
        childrenElements.push(child as HTMLElement)
      }

      const subHierarchy: ExpandedHierarchyType = {
        id: `${hierarchy.id}#${jsxTagName}[${indexOfStackElement}]`,
        name: jsxTagName,
        start: jsxElement.getStart(),
        element: stackElement,
        childrenElements,
        childrenElementsStack: [...childrenElements],
        children: [],
        context: hierarchy.context,
      }

      if (jsxKind === SyntaxKind.JsxSelfClosingElement) {
        console.log('<-- !!!')

        hierarchy.children.push(subHierarchy)

        return true
      }

      const results = (jsxElement as JsxElement).getJsxChildren().map(jsxChild => inferJsx(subHierarchy, jsxChild))

      if (results.every(x => x)) {
        console.log('<-- !!!')

        hierarchy.children.push(subHierarchy)

        return true
      }

      console.log('<-- ... (children inference)')

      return false
    }

    /* --
      * JsxFragment
    -- */
    if (jsxKind === SyntaxKind.JsxFragment) {
      console.log('--> inferring fragment')

      const jsxFragment = jsx as JsxFragment
      const results = jsxFragment.getJsxChildren().map(jsxChild => inferJsx(hierarchy, jsxChild))

      return results.every(x => x)
    }

    /* --
      * JsxText
    -- */
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

      const subHierarchy: ExpandedHierarchyType = {
        id: `${hierarchy.id}#text[${indexOfStackElement}]`,
        name: 'text',
        start: jsxText.getStart(),
        element: stackElement,
        childrenElements: [],
        childrenElementsStack: [],
        children: [],
        context: hierarchy.context,
      }

      hierarchy.children.push(subHierarchy)

      return true
    }

    /* --
      * JsxExpression
    -- */
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

      const expressionKind = expression.getKind()

      /* --
        * JsxExpression StringLiteral
      -- */
      if (expressionKind === SyntaxKind.StringLiteral) {
        const stringLiteral = expression as StringLiteral
        const stringLiteralTextValue = stringLiteral.getLiteralText()

        if (element.nodeType !== Node.TEXT_NODE || element.textContent !== stringLiteralTextValue) {
          console.log('<-- ...')

          return false
        }

        console.log('<-- !!!')

        const stackElement = hierarchy.childrenElementsStack.shift()!
        const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

        const subHierarchy: ExpandedHierarchyType = {
          id: `${hierarchy.id}#text[${indexOfStackElement}]`,
          name: 'text',
          start: stringLiteral.getStart(),
          element: stackElement,
          childrenElements: [],
          childrenElementsStack: [],
          children: [],
          context: hierarchy.context,
        }

        hierarchy.children.push(subHierarchy)

        return true
      }

      /* --
        * JsxExpression Identifier
      -- */
      if (expressionKind === SyntaxKind.Identifier) {
        const identifier = expression as Identifier
        const identifierType = identifier.getType()

        /* --
          * JsxExpression Identifier string/number
        -- */
        if (identifierType.isString() || identifierType.isNumber()) {
          if (element.nodeType !== Node.TEXT_NODE) {
            console.log('<-- ...')

            return false
          }

          console.log('<-- !!!')

          const stackElement = hierarchy.childrenElementsStack.shift()!
          const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

          const subHierarchy: ExpandedHierarchyType = {
            id: `${hierarchy.id}#text[${indexOfStackElement}]`,
            name: 'text',
            start: identifier.getStart(),
            element: stackElement,
            childrenElements: [],
            childrenElementsStack: [],
            children: [],
            context: hierarchy.context,
          }

          hierarchy.children.push(subHierarchy)

          return true
        }

        console.log('--> NON INFERRED jsxExpression identifier:', identifierType.getText())

        return false
      }

      console.log('--> NON INFERRED jsxExpression:', expression.getKindName())

      return false
    }

    console.log('--> NON INFERRED:', jsx.getKindName())

    return false
  }

  /* --
    * EXECUTION
  -- */

  console.log('\n___TRAVERSAL_START___', filePath)

  const startTime = Date.now()

  traverseImportsAndExports(sourceFile)

  const hierarchy = traverseHierarchy(sourceFile)

  console.log('___TRAVERSAL_END___', filePath, Date.now() - startTime)

  // console.log('imports', imports)
  // console.log('exports', exports)

  return hierarchy ?? null
}

/* --
  * HIERARCHY HELPERS
-- */

function cloneHierarchy(hierarchy: ExpandedHierarchyType): ExpandedHierarchyType {
  return {
    ...hierarchy,
    childrenElementsStack: [...hierarchy.childrenElementsStack],
    children: hierarchy.children.map(cloneHierarchy),
  }
}

function countHierarchyStack(hierarchy: ExpandedHierarchyType): number {
  return hierarchy.childrenElementsStack.length + hierarchy.children.map(countHierarchyStack).reduce((sum, count) => sum + count, 0)
}

function getHierarchyRootElements(hierarchy: ExpandedHierarchyType): HTMLElement[] {
  return hierarchy.element ? [hierarchy.element] : hierarchy.children.map(getHierarchyRootElements).flat()
}

function cleanHierarchy(hierarchy: ExpandedHierarchyType): HierarchyType {
  const nextHierarchy: Partial<ExpandedHierarchyType> = { ...hierarchy }

  delete nextHierarchy.context
  delete nextHierarchy.childrenElements
  delete nextHierarchy.childrenElementsStack

  nextHierarchy.children?.forEach(childHierarchy => {
    cleanHierarchy(childHierarchy)
  })

  return nextHierarchy as HierarchyType
}
