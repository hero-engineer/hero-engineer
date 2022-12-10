import {
  CallExpression,
  ExportAssignment,
  Expression,
  FunctionDeclaration,
  Identifier,
  ImportDeclaration,
  JsxChild,
  JsxElement,
  JsxExpression,
  JsxFragment,
  JsxSelfClosingElement,
  JsxText,
  ParenthesizedExpression,
  Project,
  SourceFile,
  StringLiteral,
  SyntaxKind,
  Node as TsNode,
  ts,
} from 'ts-morph'

import {
  ExpandedHierarchyContextType,
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

function createHierarchySync(filePath: string, componentElements: HTMLElement[], parentContext?: ExpandedHierarchyContextType) {
  const sourceFile = project.getSourceFile(filePath)

  if (!sourceFile) return null

  const imports: ImportType[] = []
  const exports: ExportType[] = []
  const topJsxs: Record<string, JsxElement | JsxFragment> = {}
  const createId = createIdFactory()

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
    * TOP JSX TRAVERSAL
  -- */

  function traverseTopJsx(sourceFile: SourceFile) {
    (sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement).filter(jsxElement => {
      const parentKind = jsxElement.getParent().getKind()

      return parentKind !== SyntaxKind.JsxElement && parentKind !== SyntaxKind.JsxFragment
    }) ?? []).forEach(topJsx => {
      topJsxs[createId()] = topJsx
    })

    ;(sourceFile.getDescendantsOfKind(SyntaxKind.JsxFragment).filter(jsxFragment => {
      const parentKind = jsxFragment.getParent().getKind()

      return parentKind !== SyntaxKind.JsxElement && parentKind !== SyntaxKind.JsxFragment
    }) ?? []).forEach(topJsx => {
      topJsxs[createId()] = topJsx
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

          const id = `${parentContext?.id ?? ''}${filePath}#${functionName}`
          const hierarchy: ExpandedHierarchyType = {
            id,
            name: functionName,
            start: node.getStart(),
            element: null,
            childrenElements: [...componentElements],
            childrenElementsStack: [...componentElements],
            children: [],
            context: {
              id: `${id}#`,
              previousTopJsxIds: [],
              children: parentContext?.children ?? [],
              imports: [...parentContext?.imports ?? [], ...imports],
            },
          }

          const inferredHierarchy = inferJsxs(hierarchy)

          if (inferredHierarchy) Object.assign(hierarchy, inferredHierarchy)

          return hierarchy
        }
      }
    })
  }

  /* --
    * INFER JSXS
  -- */

  function inferJsxs(hierarchy: ExpandedHierarchyType, jsx: Record<string, TsNode> = topJsxs) {
    const inferId = createId()

    const filteredJsxEntries = Object.entries(jsx).filter(([id]) => !hierarchy.context.previousTopJsxIds.includes(id))

    console.log('___INFER_START___, id:', inferId, 'jsxIds:', filteredJsxEntries.map(([id]) => id))

    const result = filteredJsxEntries
    .map(([id, jsx]) => {
      console.log('_________________, inferId:', inferId, 'jsxId:', id)

      const hierarchyClone = cloneHierarchy(hierarchy)

      hierarchyClone.context.previousTopJsxIds.push(id)

      const inferred = inferJsx(hierarchyClone, jsx)
      const indexOfId = hierarchyClone.context.previousTopJsxIds.indexOf(id)

      if (indexOfId !== -1) hierarchyClone.context.previousTopJsxIds.splice(indexOfId, 1)

      return {
        inferred,
        hierarchy: hierarchyClone,
      }
    })
    .filter(x => x.inferred)
    .map(x => ({
      hierarchy: x.hierarchy,
      stackCount: countHierarchyStack(x.hierarchy),
    }))
    .reduce<{ hierarchy: ExpandedHierarchyType | null, stackCount: number}>((a, b) => a.stackCount < b.stackCount ? a : b, { hierarchy: null, stackCount: Infinity })

    if (result.hierarchy) console.log('___INFER_END___, id:', inferId, 'stack count:', result.stackCount)
    else console.log('___INFER_END___, id:', inferId, '...')

    return result.hierarchy
  }

  /* --
    * INFER JSX
  -- */

  function inferJsx(hierarchy: ExpandedHierarchyType, node: TsNode): boolean {
    const nodeKind = node.getKind()

    /* --
      * JsxElement
    -- */
    if (nodeKind === SyntaxKind.JsxElement || nodeKind === SyntaxKind.JsxSelfClosingElement) {
      const jsxElement = node as JsxElement | JsxSelfClosingElement
      const jsxTagName = ((jsxElement as JsxElement).getOpeningElement?.() ?? jsxElement as JsxSelfClosingElement).getTagNameNode().getText()
      const element = hierarchy.childrenElementsStack[0]

      console.log('--> JsxElement', jsxTagName, '~', element)

      /* --
        * JsxElement Component
      -- */
      if (jsxTagName[0] === jsxTagName[0].toUpperCase()) {
        console.log('hierarchy.context.imports', hierarchy.context.imports)
        const foundImport = hierarchy.context.imports.find(x => x.name === jsxTagName)

        if (!foundImport) {
          console.log('<-- ... JsxElement', jsxTagName, '(no corresponding import was found)')

          return false
        }

        const { sourceFilePath } = foundImport

        if (!sourceFilePath || sourceFilePath.includes('/node_modules/')) {
          console.log('<-- ... JsxElement', jsxTagName, '(import is node_modules)')

          return false
        }

        console.log('----> found', foundImport.name)

        const subHierarchy = createHierarchySync(sourceFilePath, hierarchy.childrenElementsStack, {
          ...hierarchy.context,
          children: (jsxElement as JsxElement).getJsxChildren?.() ?? [],
        })

        if (!subHierarchy) {
          console.log('<----- ... JsxElement', jsxTagName, '(no hierarchy was created)')

          return false
        }

        console.log('<----- !!! JsxElement', jsxTagName)

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
        console.log('<-- ... JsxElement', jsxTagName, '(no element or element is text type)')

        return false
      }

      const elementTagName = element.tagName.toLowerCase()

      if (jsxTagName !== elementTagName) {
        console.log('<-- ... JsxElement', jsxTagName, '(tag mismatch)')

        return false
      }

      /* --
        * JsxElement tag
      -- */
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

      if (nodeKind === SyntaxKind.JsxSelfClosingElement) {
        console.log('<-- !!! JsxElement tag', jsxTagName)

        hierarchy.children.push(subHierarchy)

        return true
      }

      const results = (jsxElement as JsxElement).getJsxChildren().map(jsxChild => inferJsx(subHierarchy, jsxChild))

      if (results.every(x => x)) {
        console.log('<-- !!! JsxElement tag', jsxTagName)

        hierarchy.children.push(subHierarchy)

        return true
      }

      console.log('<-- ... JsxElement tag', jsxTagName, '(children inference)')

      return false
    }

    /* --
      * JsxFragment
    -- */
    if (nodeKind === SyntaxKind.JsxFragment) {
      console.log('--> JsxFragment')

      const jsxFragment = node as JsxFragment
      const inferred = jsxFragment.getJsxChildren().map(jsxChild => inferJsx(hierarchy, jsxChild)).every(x => x)

      if (inferred) console.log('<-- !!! JsxFragment')
      else console.log('<-- ... JsxFragment (children inference)')

      return inferred
    }

    /* --
      * JsxText
    -- */
    if (nodeKind === SyntaxKind.JsxText) {
      const jsxText = node as JsxText
      const jsxTextValue = jsxText.getLiteralText().trim()

      if (!jsxTextValue) return true

      const element = hierarchy.childrenElementsStack[0]

      console.log('--> JsxText', jsxTextValue, '~', element)

      if (!element || element.nodeType !== Node.TEXT_NODE || element.textContent?.trim() !== jsxTextValue) {
        console.log('<-- ... JsxText (no element or element is not text or text value mismatch)')

        return false
      }

      console.log('<-- !!! JsxText')

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
    if (nodeKind === SyntaxKind.JsxExpression) {
      const jsxExpression = node as JsxExpression
      const expression = jsxExpression.getExpression()

      if (!expression) return true

      const element = hierarchy.childrenElementsStack[0]

      console.log('--> JsxExpression', jsxExpression.getText(), '~', element)

      if (!element) {
        console.log('<-- ... JsxExpression (no element)')

        return false
      }

      const inferred = inferJsx(hierarchy, expression)

      if (inferred) console.log('<-- !!! JsxExpression')
      else console.log('<-- ... JsxExpression (expression inference)')

      return inferred
    }

    /* --
      * StringLiteral
    -- */
    if (nodeKind === SyntaxKind.StringLiteral) {
      const stringLiteral = node as StringLiteral
      const stringLiteralTextValue = stringLiteral.getLiteralText()
      const element = hierarchy.childrenElementsStack[0]

      if (element.nodeType !== Node.TEXT_NODE || element.textContent !== stringLiteralTextValue) {
        console.log('<-- ... JsxExpression StringLiteral (element is not text or text value mismatch)')

        return false
      }

      console.log('<-- !!! JsxExpression StringLiteral')

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
      * Identifier
    -- */
    if (nodeKind === SyntaxKind.Identifier) {
      const identifier = node as Identifier

      /* --
        * Identifier children
      -- */
      if (identifier.getText() === 'children') {
        if (parentContext) {
          console.log('___FOUND_CHILDREN___, parent children:', parentContext.children.length)

          const inferreds = parentContext.children.map(jsxChild => inferJsx(hierarchy, jsxChild))

          let inferredCount = 0

          for (const inferred of inferreds) {
            if (inferred) inferredCount++
            else break
          }

          const inferred = inferredCount > 0

          if (inferred) console.log('<-- !!! JsxExpression Identifier children')
          else console.log('<-- ... JsxExpression Identifier children (children inference)')

          return inferred
        }

        console.log('--> NO PARENT CONTEXT FOR CHILDREN IDENTIFIER')

        return false
      }

      const identifierType = identifier.getType()

      /* --
        * Identifier JSX.Element
      -- */
      if (identifierType.getText() === 'JSX.Element') {
        console.log('___FOUND_JSX.ELEMENT___, will infer from all JSX found')

        const inferredHierarchy = inferJsxs(hierarchy)

        if (inferredHierarchy) {
          console.log('<-- !!! JsxExpression Identifier JSX.Element')

          Object.assign(hierarchy, inferredHierarchy)

          return true
        }

        console.log('<-- ... JsxExpression Identifier JSX.Element (jsxs inference)')

        return false
      }

      /* --
        * Identifier string/number
      -- */
      if (identifierType.isString() || identifierType.isNumber()) {
        const element = hierarchy.childrenElementsStack[0]

        if (element.nodeType !== Node.TEXT_NODE) {
          console.log('<-- ... JsxExpression Identifier string/number (element is not text)')

          return false
        }

        console.log('<-- !!! JsxExpression Identifier string/number')

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

    /* --
      * CallExpression
    -- */
    if (nodeKind === SyntaxKind.CallExpression) {
      const callExpression = node as CallExpression
      const functionName = callExpression.getExpression().getText()
      const functionDeclaration = findFunctionDeclarationInParents(node, functionName)

      if (!functionDeclaration) {
        console.log('<-- ... JsxExpression CallExpression (function declaration not found)')

        return false
      }

      const returnExpressions = visitFunctionDeclaration(functionDeclaration)

      const jsxs = returnExpressions.reduce((jsxs, returnExpression) => ({ ...jsxs, [createId()]: returnExpression }), {})

      const inferredHierarchy = inferJsxs(hierarchy, jsxs)

      if (inferredHierarchy) {
        console.log('<-- !!! JsxExpression CallExpression')

        Object.assign(hierarchy, inferredHierarchy)

        return true
      }

      console.log('<-- ... JsxExpression CallExpression (jsxs inference)')

      return false
    }

    /* --
      * TrueKeyword/FalseKeyword/NullKeyword
    -- */
    if (nodeKind === SyntaxKind.TrueKeyword || nodeKind === SyntaxKind.FalseKeyword || nodeKind === SyntaxKind.NullKeyword) {
      return true
    }

    console.log('--> NON INFERRED:', node.getKindName())

    return false
  }

  /* --
    * EXECUTION
  -- */

  console.log('\n___TRAVERSAL_START___', filePath)

  const startTime = Date.now()

  traverseImportsAndExports(sourceFile)
  traverseTopJsx(sourceFile)

  const hierarchy = traverseHierarchy(sourceFile)

  console.log('___TRAVERSAL_END___', filePath, Date.now() - startTime)

  // Clearing the stack to needed after a full traversal to infer the stack count of the parent component correctly
  // The remaining stack elements come from the parent's stack
  return hierarchy ? clearHierarchyStack(hierarchy) : null
}

/* --
    * VISIT FUNCTION DECLARATION
  -- */

function visitFunctionDeclaration(functionDeclaration: FunctionDeclaration) {
  return functionDeclaration.getDescendantsOfKind(SyntaxKind.ReturnStatement)
    .map(returnStatement => returnStatement.getExpression())
    .filter(expression => expression)
    .map(expression => extractExpression(expression!))
}

/* --
  * TRAVERSAL HELPERS
-- */

function findFunctionDeclarationInParents(node: TsNode, functionName: string): FunctionDeclaration | null {
  const functionDeclarations = node.getChildrenOfKind(SyntaxKind.FunctionDeclaration)

  const foundFunctionDeclaration = functionDeclarations.find(functionDeclaration => functionDeclaration.getName() === functionName)

  if (foundFunctionDeclaration) return foundFunctionDeclaration

  const parent = node.getParent()

  if (!parent) return null

  return findFunctionDeclarationInParents(parent, functionName)
}

function extractExpression(expression: Expression): Expression {
  if (expression.getKind() === SyntaxKind.ParenthesizedExpression) {
    return extractExpression((expression as ParenthesizedExpression).getExpression())
  }

  return expression
}

/* --
  * HIERARCHY HELPERS
-- */

function cloneHierarchy(hierarchy: ExpandedHierarchyType): ExpandedHierarchyType {
  return {
    ...hierarchy,
    // No need to clone childrenElements
    childrenElementsStack: [...hierarchy.childrenElementsStack],
    children: hierarchy.children.map(cloneHierarchy),
    context: {
      ...hierarchy.context,
      previousTopJsxIds: [...hierarchy.context.previousTopJsxIds],
      imports: [...hierarchy.context.imports],
      children: [...hierarchy.context.children],
    },
  }
}

function countHierarchyStack(hierarchy: ExpandedHierarchyType): number {
  return hierarchy.childrenElementsStack.length + hierarchy.children.map(countHierarchyStack).reduce((sum, count) => sum + count, 0)
}

function getHierarchyRootElements(hierarchy: ExpandedHierarchyType): HTMLElement[] {
  return hierarchy.element ? [hierarchy.element] : hierarchy.children.map(getHierarchyRootElements).flat()
}

function clearHierarchyStack(hierarchy: ExpandedHierarchyType) {
  hierarchy.childrenElementsStack.length = 0

  hierarchy.children.forEach(clearHierarchyStack)

  return hierarchy
}

function cleanHierarchy(hierarchy: ExpandedHierarchyType): HierarchyType {
  const nextHierarchy: Partial<ExpandedHierarchyType> = { ...hierarchy }

  delete nextHierarchy.context
  delete nextHierarchy.childrenElements
  delete nextHierarchy.childrenElementsStack

  return {
    ...nextHierarchy,
    children: nextHierarchy.children?.map(cleanHierarchy) ?? [],
  } as HierarchyType
}

/* --
  * COMMON HELPERS
-- */

function createIdFactory() {
  let cursor = 0

  return () => cursor++
}
