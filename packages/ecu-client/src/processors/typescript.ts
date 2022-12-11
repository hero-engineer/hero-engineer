import {
  ArrowFunction,
  CallExpression,
  ExportAssignment,
  Expression,
  FunctionDeclaration,
  Identifier,
  ImportDeclaration,
  JsxElement,
  JsxExpression,
  JsxFragment,
  JsxSelfClosingElement,
  JsxText,
  NumericLiteral,
  ParenthesizedExpression,
  Project,
  SourceFile,
  StringLiteral,
  SyntaxKind,
  TemplateExpression,
  Node as TsNode,
  ts,
} from 'ts-morph'

import {
  ExportType,
  ExtendedHierarchyContextType,
  ExtendedHierarchyType,
  FileType,
  HierarchyType,
  IdentifierType,
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

export const hierarchyIdSeparator = `__id_${Math.random()}__`

export const hierarchyIndexSeparator = `__index_${Math.random()}__`

export const hierarchyComponentSeparator = `__component_${Math.random()}__`

export const hierarchyMapSeparator = `__map_${Math.random()}__`

const allowedFunctionComponentFirstCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export async function createHierarchy(filePath: string, componentElements: HTMLElement[]) {
  await projectReady.promise

  const hierarchy = createHierarchySync(filePath, componentElements)

  return hierarchy ? cleanHierarchy(hierarchy) : null
}

function createHierarchySync(filePath: string, componentElements: HTMLElement[], parentContext?: ExtendedHierarchyContextType) {
  const sourceFile = project.getSourceFile(filePath)

  if (!sourceFile) return null

  const imports: ImportType[] = []
  const exports: ExportType[] = []
  const identifiers: IdentifierType[] = []
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
    * IDENTIFIERS TRAVERSAL
  -- */

  function traverseIdentifiers(sourceFile: SourceFile) {
    sourceFile.forEachDescendant(node => {
      if (node.getKind() !== SyntaxKind.Identifier) return

      const identifer = node as Identifier
      const identifierParent = identifer.getParent()
      const identiferParentKind = identifierParent.getKind()

      if (identiferParentKind !== SyntaxKind.VariableDeclaration && identiferParentKind !== SyntaxKind.FunctionDeclaration) return

      identifiers.push({
        name: identifer.getText(),
        value: identifierParent,
      })
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
    for (const functionDeclaration of sourceFile.getChildrenOfKind(SyntaxKind.FunctionDeclaration)) {
      const functionName = functionDeclaration.getName() ?? ''

      if (!(functionName && allowedFunctionComponentFirstCharacters.includes(functionName[0]))) continue

      const isDefaultExport = exports.find(e => e.name === functionName)?.type === 'default'

      if (!isDefaultExport) continue // For now

      const id = `${parentContext?.id ?? ''}${filePath}${hierarchyIdSeparator}${functionName}`
      const hierarchy: ExtendedHierarchyType = {
        id,
        name: functionName,
        start: functionDeclaration.getFullStart(),
        element: null,
        childrenElements: [...componentElements],
        childrenElementsStack: [...componentElements],
        children: [],
        context: {
          id: `${id}${hierarchyComponentSeparator}`,
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

  /* --
    * INFER JSXS
  -- */

  function inferJsxs(hierarchy: ExtendedHierarchyType, jsx: Record<string, TsNode> = topJsxs) {
    const inferId = createId()

    const filteredJsxEntries = Object.entries(jsx).filter(([id]) => !hierarchy.context.previousTopJsxIds.includes(id))

    console.log(`___INFER_START___ id: ${inferId}, jsxIds: ${filteredJsxEntries.map(([id]) => id)}`)

    const result = filteredJsxEntries
    .map(([id, jsx]) => {
      console.log(`___INFER___ id: ${inferId}, jsxId: ${id}`)

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
    .reduce<{ hierarchy: ExtendedHierarchyType | null, stackCount: number}>((a, b) => a.stackCount < b.stackCount ? a : b, { hierarchy: null, stackCount: Infinity })

    if (result.hierarchy) console.log(`___INFER_END___ id: ${inferId}, stack count: ${result.stackCount}`)
    else console.log(`___INFER_END___ id: ${inferId} ...`)

    return result.hierarchy
  }

  /* --
    * INFER JSX
  -- */

  function inferJsx(hierarchy: ExtendedHierarchyType, node?: TsNode, nextNodes: TsNode[] = []): boolean {
    if (!node) {
      console.log('NO NODE TO INFER')

      return false
    }

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

      const subHierarchy: ExtendedHierarchyType = {
        id: `${hierarchy.id}${hierarchyIdSeparator}${jsxTagName}${hierarchyIndexSeparator}${indexOfStackElement}`,
        name: jsxTagName,
        start: jsxElement.getFullStart(),
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

      const results = (jsxElement as JsxElement).getJsxChildren().map((jsxChild, i, a) => inferJsx(subHierarchy, jsxChild, a.slice(i + 1)))

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
      const inferred = jsxFragment.getJsxChildren().map((jsxChild, i, a) => inferJsx(hierarchy, jsxChild, a.slice(i + 1))).every(x => x)

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
        console.log('<-- ... JsxText (no element or element is not text or text mismatch)')

        return false
      }

      console.log('<-- !!! JsxText')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

      const subHierarchy: ExtendedHierarchyType = {
        id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
        name: 'text',
        start: jsxText.getFullStart(),
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

      const inferred = inferJsx(hierarchy, expression, nextNodes)

      if (inferred) console.log('<-- !!! JsxExpression')
      else console.log('<-- ... JsxExpression (expression inference)')

      return inferred
    }

    /* --
      * Identifier/PropertyAccessExpression
    -- */
    if (nodeKind === SyntaxKind.Identifier || nodeKind === SyntaxKind.PropertyAccessExpression) {

      /* --
        * children
      -- */
      if (node.getText() === 'children') {
        if (parentContext) {
          console.log('___CHILDREN___, parent children:', parentContext.children.length)

          const inferreds = parentContext.children.map((jsxChild, i, a) => inferJsx(hierarchy, jsxChild, a.slice(i + 1)))

          let inferredCount = 0

          for (const inferred of inferreds) {
            if (inferred) inferredCount++
            else break
          }

          const inferred = inferredCount > 0

          if (inferred) console.log('<-- !!! children')
          else console.log('<-- ... children (children inference)')

          return inferred
        }

        console.log('--> NO PARENT CONTEXT FOR CHILDREN')

        return false
      }

      const nodeType = node.getType()

      /* --
        * JSX.Element
      -- */
      if (nodeType.getText() === 'JSX.Element') {
        console.log('___JSX.ELEMENT___, will infer from all JSX found')

        const inferredHierarchy = inferJsxs(hierarchy)

        if (inferredHierarchy) {
          console.log('<-- !!! JSX.Element')

          Object.assign(hierarchy, inferredHierarchy)

          return true
        }

        console.log('<-- ... JSX.Element (jsxs inference)')

        return false
      }

      /* --
        * Array
      -- */
      if (nodeType.isArray()) {
        console.log('___ARRAY_START___')

        const mapId = createId()
        const subHierarchy: ExtendedHierarchyType = {
          id: `${hierarchy.id}${hierarchyIdSeparator}map${hierarchyMapSeparator}${mapId}`,
          name: 'map',
          start: node.getFullStart(),
          element: null,
          childrenElements: hierarchy.childrenElements,
          childrenElementsStack: [...hierarchy.childrenElementsStack],
          children: [],
          context: hierarchy.context,
        }

        hierarchy.children.push(subHierarchy)

        let inferCount = 0

        while (true) {
          let inferredNext = true

          console.log(`___ARRAY_NEXT__ id: ${mapId}, inferCount: ${inferCount}`)

          for (let i = 0; i < 3; i++) {
            if (!nextNodes[i]) break

            inferredNext = inferJsx(cloneHierarchy(subHierarchy), nextNodes[i], nextNodes.slice(i + 1))

            if (!inferredNext) break
          }

          if (inferredNext) break
          else {
            subHierarchy.childrenElementsStack.shift()
            inferCount++
          }
        }

        console.log(`___ARRAY_END__ id: ${mapId}, inferCount: ${inferCount}`)

        if (inferCount) {
          console.log('<-- !!! Array')

          removeStackFrom(hierarchy, subHierarchy)

          return true
        }

        console.log('<-- ... Array (jsxs inference)')

        return false
      }

      /* --
        * string
      -- */
      if (nodeType.isString()) {
        const element = hierarchy.childrenElementsStack[0]

        console.log('--> string ~', element)

        if (element.nodeType !== Node.TEXT_NODE) {
          console.log('<-- ... string (element is not text)')

          return false
        }

        console.log('<-- !!! string')

        const stackElement = hierarchy.childrenElementsStack.shift()!
        const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

        const subHierarchy: ExtendedHierarchyType = {
          id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
          name: 'text',
          start: node.getFullStart(),
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
        * number
      -- */
      if (nodeType.isNumber()) {
        const element = hierarchy.childrenElementsStack[0]

        console.log('--> number ~', element)

        if (element.nodeType !== Node.TEXT_NODE || Number(element.textContent) !== Number(element.textContent)) {
          console.log('<-- ... number (element is not text or text is not a number)')

          return false
        }

        console.log('<-- !!! number')

        const stackElement = hierarchy.childrenElementsStack.shift()!
        const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

        const subHierarchy: ExtendedHierarchyType = {
          id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
          name: 'text',
          start: node.getFullStart(),
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
        * boolean/null
      -- */
      if (nodeType.isBoolean() || nodeType.isNull()) {
        return true
      }

      console.log('--> NON INFERRED common node:', nodeType.getText())

      return false
    }

    /* --
      * CallExpression
    -- */
    if (nodeKind === SyntaxKind.CallExpression) {
      const callExpression = node as CallExpression
      const functionName = callExpression.getExpression().getText()

      console.log('--> CallExpression', functionName)

      // HACK for now
      // TODO check for Array
      if (functionName.endsWith('.map')) {
        let predicate = callExpression.getArguments()[0]

        if (!predicate) {
          console.log('<-- ... CallExpression map (map predicate not found)')

          return false
        }

        let predicateKind = predicate.getKind()

        if (predicateKind === SyntaxKind.Identifier) {
          const predicateName = predicate.getText()
          const foundIdentifer = findClosestScopedIdentifier(identifiers.filter(x => x.name === predicateName), callExpression)

          if (!foundIdentifer) {
            console.log('<-- ... CallExpression map (identifer not found)', predicateName)

            return false
          }

          predicate = foundIdentifer.value
          predicateKind = predicate.getKind()
        }

        if (predicateKind === SyntaxKind.ArrowFunction || predicateKind === SyntaxKind.FunctionDeclaration || predicateKind === SyntaxKind.Identifier) {
          const mapId = createId()

          console.log(`___MAP_START__ id: ${mapId}`)

          const returnExpressions = visitFunctionDeclaration(predicate as ArrowFunction | FunctionDeclaration)
          const jsxs = returnExpressions.reduce((jsxs, returnExpression) => ({ ...jsxs, [createId()]: returnExpression }), {})

          const subHierarchy: ExtendedHierarchyType = {
            id: `${hierarchy.id}${hierarchyIdSeparator}map${hierarchyMapSeparator}${mapId}`,
            name: 'map',
            start: callExpression.getFullStart(),
            element: null,
            childrenElements: hierarchy.childrenElements,
            childrenElementsStack: [...hierarchy.childrenElementsStack],
            children: [],
            context: hierarchy.context,
          }

          hierarchy.children.push(subHierarchy)

          let inferCount = 0

          while (true) {
            console.log(`___MAP__ id: ${mapId}, inferCount: ${inferCount}`)
            const inferredHierarchy = inferJsxs(subHierarchy, jsxs)

            if (!inferredHierarchy) break

            inferCount++

            Object.assign(subHierarchy, inferredHierarchy)

            let inferredNext = true

            console.log(`___MAP_NEXT__ id: ${mapId}, inferCount: ${inferCount}`)

            for (let i = 0; i < 3; i++) {
              if (!nextNodes[i]) break

              inferredNext = inferJsx(cloneHierarchy(subHierarchy), nextNodes[i], nextNodes.slice(i + 1))

              if (!inferredNext) break
            }

            if (inferredNext) break
          }

          console.log(`___MAP_END__ id: ${mapId}, inferCount: ${inferCount}`)

          if (inferCount) {
            console.log('<-- !!! CallExpression map')

            removeStackFrom(hierarchy, subHierarchy)

            return true
          }

          console.log('<-- ... CallExpression map (jsxs inference)')

          return false
        }

        console.log('<-- ... CallExpression map (predicate kind not supported)', predicate.getKindName())

        return false
      }

      const functionDeclaration = findFunctionDeclarationInParents(node, functionName)

      if (!functionDeclaration) {
        console.log('<-- ... CallExpression (function declaration not found)')

        return false
      }

      const returnExpressions = visitFunctionDeclaration(functionDeclaration)

      const jsxs = returnExpressions.reduce((jsxs, returnExpression) => ({ ...jsxs, [createId()]: returnExpression }), {})

      const inferredHierarchy = inferJsxs(hierarchy, jsxs)

      if (inferredHierarchy) {
        console.log('<-- !!! CallExpression')

        Object.assign(hierarchy, inferredHierarchy)

        return true
      }

      console.log('<-- ... CallExpression (jsxs inference)')

      return false
    }

    /* --
      * StringLiteral/NumericLiteral
    -- */
    if (nodeKind === SyntaxKind.StringLiteral || nodeKind === SyntaxKind.NumericLiteral) {
      const literal = node as (StringLiteral | NumericLiteral)
      const literalValue = literal.getLiteralValue().toString()
      const element = hierarchy.childrenElementsStack[0]

      console.log('--> StringLiteral/NumericLiteral', literalValue, '~', element)

      if (element.nodeType !== Node.TEXT_NODE || element.textContent !== literalValue) {
        console.log('<-- ... StringLiteral/NumericLiteral (element is not text or text mismatch)')

        return false
      }

      console.log('<-- !!! StringLiteral/NumericLiteral')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

      const subHierarchy: ExtendedHierarchyType = {
        id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
        name: 'text',
        start: literal.getFullStart(),
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
      * TemplateExpression
    -- */
    if (nodeKind === SyntaxKind.TemplateExpression) {
      const templateExpression = node as TemplateExpression
      const element = hierarchy.childrenElementsStack[0]

      console.log('--> TemplateExpression', templateExpression.getText(), '~', element)

      if (element.nodeType !== Node.TEXT_NODE) {
        console.log('<-- ... TemplateExpression (element is not text)')

        return false
      }

      console.log('<-- !!! TemplateExpression')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

      const subHierarchy: ExtendedHierarchyType = {
        id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
        name: 'text',
        start: templateExpression.getFullStart(),
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
  traverseIdentifiers(sourceFile)
  traverseTopJsx(sourceFile)

  const hierarchy = traverseHierarchy(sourceFile)

  console.log('___TRAVERSAL_END___', filePath, Date.now() - startTime)

  // Clearing the stack to needed after a full traversal to infer the stack count of the parent component correctly
  // The remaining stack elements come from the parent's stack
  return hierarchy ? clearHierarchyStack(hierarchy) : null
}

/* --
  * COMMON VISITORS
-- */

function visitFunctionDeclaration(functionDeclaration: FunctionDeclaration | ArrowFunction) {
  if (functionDeclaration.getKind() === SyntaxKind.FunctionDeclaration) {
    return visitReturnStatements(functionDeclaration)
  }

  const body = functionDeclaration.getBody()

  if (!body) return []

  if (body.getKind() === SyntaxKind.Block) {
    return visitReturnStatements(functionDeclaration)
  }

  return [extractExpression(body as Expression)]
}

function visitReturnStatements(node: TsNode) {
  return node.getDescendantsOfKind(SyntaxKind.ReturnStatement)
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

function findClosestScopedIdentifier(identifiers: IdentifierType[], node: TsNode) {
  if (!identifiers.length) return null

  const nodeParents = getParents(node)

  return identifiers
  .map(identifier => ({
    identifier,
    commonParentsCount: countCommonItemsAtStart(getParents(identifier.value), nodeParents),
  }))
  .reduce((a, b) => a.commonParentsCount > b.commonParentsCount ? a : b, { identifier: identifiers[0], commonParentsCount: 0 })
  .identifier
}

function getParents(node: TsNode): TsNode[] {
  if (!node) return []

  const parent = node.getParent()

  if (!parent) return []

  return [...getParents(parent), parent]
}

/* --
  * HIERARCHY HELPERS
-- */

function cloneHierarchy(hierarchy: ExtendedHierarchyType): ExtendedHierarchyType {
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

function countHierarchyStack(hierarchy: ExtendedHierarchyType): number {
  return hierarchy.childrenElementsStack.length + hierarchy.children.map(countHierarchyStack).reduce((sum, count) => sum + count, 0)
}

function getHierarchyRootElements(hierarchy: ExtendedHierarchyType): HTMLElement[] {
  return hierarchy.element ? [hierarchy.element] : hierarchy.children.map(getHierarchyRootElements).flat()
}

function clearHierarchyStack(hierarchy: ExtendedHierarchyType) {
  hierarchy.childrenElementsStack.length = 0

  hierarchy.children.forEach(clearHierarchyStack)

  return hierarchy
}

function cleanHierarchy(hierarchy: ExtendedHierarchyType): HierarchyType {
  const nextHierarchy: Partial<ExtendedHierarchyType> = { ...hierarchy }

  delete nextHierarchy.context
  delete nextHierarchy.childrenElements
  delete nextHierarchy.childrenElementsStack

  return {
    ...nextHierarchy,
    children: nextHierarchy.children?.map(cleanHierarchy) ?? [],
  } as HierarchyType
}

function removeStackFrom(a: ExtendedHierarchyType, b: ExtendedHierarchyType) {
  a.childrenElementsStack = a.childrenElementsStack.filter(element => b.childrenElementsStack.indexOf(element) !== -1)
}

/* --
  * COMMON HELPERS
-- */

function createIdFactory() {
  let cursor = 0

  return () => cursor++
}

function countCommonItemsAtStart(a: any[], b: any[]) {
  let count = 0

  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) count++
    else break
  }

  return count
}
