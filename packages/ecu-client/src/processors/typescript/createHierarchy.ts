import {
  ArrowFunction,
  CallExpression,
  ConditionalExpression,
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
  ParenthesizedExpression, SourceFile,
  StringLiteral,
  SyntaxKind,
  TemplateExpression,
  Node as TsNode,
} from 'ts-morph'

import {
  ExportType,
  ExtendedHierarchyContextType,
  ExtendedHierarchyType, HierarchyType,
  IdentifierType,
  ImportType,
} from '~types'

import project, { projectReady } from '~processors/typescript'

/* --
  * HIERARCHY
-- */

export const hierarchyFileSeparator = '__@@##file##@@__'

export const hierarchyIdSeparator = '__@@##id##@@__'

export const hierarchyIndexSeparator = '__@@##index##@@__'

export const hierarchyComponentSeparator = '__@@##component##@@__'

const allowedFunctionComponentFirstCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

async function createHierarchy(filePath: string, componentElements: HTMLElement[], shouldLog = false) {
  await projectReady.promise

  const hierarchy = createHierarchySync(filePath, componentElements, undefined, shouldLog)

  return hierarchy ? cleanHierarchy(hierarchy) : null
}

function createHierarchySync(filePath: string, componentElements: HTMLElement[], parentContext?: ExtendedHierarchyContextType, shouldLog = false) {
  const sourceFile = project.getSourceFile(filePath)

  if (!sourceFile) return null

  const consoleLog = shouldLog ? console.log : () => {}
  const consoleGroup = shouldLog ? console.group : () => {}
  const consoleGroupEnd = shouldLog ? console.groupEnd : () => {}
  const consoleGroupCollapsed = shouldLog ? console.groupCollapsed : () => {}

  let childrenCount = 0
  const sourceFilePathToChildIndex: Record<string, number> = {}
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

      const id = `${parentContext?.id ?? ''}${hierarchyFileSeparator}${filePath}${hierarchyIdSeparator}${functionName}${hierarchyIndexSeparator}${parentContext?.childIndex ?? 0}`
      const hierarchy: ExtendedHierarchyType = {
        id,
        name: functionName,
        type: 'component',
        start: functionDeclaration.getFullStart(),
        element: null,
        childrenElements: [...componentElements],
        childrenElementsStack: [...componentElements],
        children: [],
        onFilePath: parentContext?.childrenOnFilePath ?? filePath,
        context: {
          id: `${id}${hierarchyComponentSeparator}`,
          previousTopJsxIds: [],
          childIndex: 0,
          children: parentContext?.children ?? [],
          imports: [...parentContext?.imports ?? [], ...imports],
          identifiers: [...parentContext?.identifiers ?? [], ...identifiers],
          childrenOnFilePath: filePath,
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

    consoleGroup(`INFER_START id: ${inferId}, jsxIds: ${filteredJsxEntries.map(([id]) => id)}`)

    const result = filteredJsxEntries
    .map(([id, jsx]) => {
      consoleGroup(`INFER_NEXT_START id: ${inferId}, jsxId: ${id}`)

      const hierarchyClone = cloneHierarchy(hierarchy)

      hierarchyClone.context.previousTopJsxIds.push(id)

      const inferred = inferJsx(hierarchyClone, jsx)
      const indexOfId = hierarchyClone.context.previousTopJsxIds.indexOf(id)

      if (indexOfId !== -1) hierarchyClone.context.previousTopJsxIds.splice(indexOfId, 1)

      const stackCount = countHierarchyStack(hierarchyClone)

      consoleGroupEnd()
      // consoleLog('hierarchyClone', hierarchyClone)
      consoleLog(`INFER_NEXT_END id: ${inferId}, jsxId: ${id}, stackCount: ${stackCount}`)

      return {
        inferred,
        hierarchy: hierarchyClone,
        stackCount,
      }
    })
    .filter(x => x.inferred)
    .reduce<{ hierarchy: ExtendedHierarchyType | null, stackCount: number}>((a, b) => a.stackCount < b.stackCount ? a : b, { hierarchy: null, stackCount: Infinity })

    consoleGroupEnd()

    if (result.hierarchy) consoleLog(`INFER_END id: ${inferId}, stack count: ${result.stackCount}`)
    else consoleLog(`INFER_END id: ${inferId} ...`)

    return result.hierarchy
  }

  /* --
    * INFER JSX
  -- */

  function inferJsx(hierarchy: ExtendedHierarchyType, node?: TsNode, nextNodes: TsNode[] = []): boolean {
    if (!node) {
      consoleLog('NO NODE TO INFER')

      return false
    }

    const nodeType = node.getType()
    const nodeKind = node.getKind()

    /* --
      * JsxElement
    -- */

    if (nodeKind === SyntaxKind.JsxElement || nodeKind === SyntaxKind.JsxSelfClosingElement) {
      const jsxElement = node as JsxElement | JsxSelfClosingElement
      const jsxTagName = ((jsxElement as JsxElement).getOpeningElement?.() ?? jsxElement as JsxSelfClosingElement).getTagNameNode().getText()
      const element = hierarchy.childrenElementsStack[0]

      consoleLog('--> JsxElement', jsxTagName, '~', element)

      /* --
        * JsxElement Component
      -- */

      if (jsxTagName[0] === jsxTagName[0].toUpperCase()) {
        const foundImport = hierarchy.context.imports.find(x => x.name === jsxTagName)

        if (!foundImport) {
          consoleLog('<-- ... JsxElement', jsxTagName, '(no corresponding import)')

          return false
        }

        const { sourceFilePath } = foundImport

        if (!sourceFilePath || sourceFilePath.includes('/node_modules/')) {
          consoleLog('<-- ... JsxElement', jsxTagName, '(import is node_modules)')

          return false
        }

        consoleLog('----> found', foundImport.name)

        if (typeof sourceFilePathToChildIndex[sourceFilePath] === 'undefined') {
          sourceFilePathToChildIndex[sourceFilePath] = 0
        }

        const subHierarchy = createHierarchySync(sourceFilePath, hierarchy.childrenElementsStack, {
          ...hierarchy.context,
          childIndex: sourceFilePathToChildIndex[sourceFilePath]++,
          children: (jsxElement as JsxElement).getJsxChildren?.() ?? [],
          childrenOnFilePath: hierarchy.onFilePath,
        }, shouldLog)

        if (!subHierarchy) {
          consoleLog('<----- ... JsxElement', jsxTagName, '(no hierarchy)')

          return false
        }

        consoleLog('<----- !!! JsxElement', jsxTagName)

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
        consoleLog('<-- ... JsxElement', jsxTagName, '(no element or element is text type)')

        return false
      }

      const elementTagName = element.tagName.toLowerCase()

      if (jsxTagName !== elementTagName) {
        consoleLog('<-- ... JsxElement', jsxTagName, '(tag mismatch)')

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
        type: 'element',
        start: jsxElement.getFullStart(),
        element: stackElement,
        childrenElements,
        childrenElementsStack: [...childrenElements],
        children: [],
        onFilePath: hierarchy.context.childrenOnFilePath,
        context: hierarchy.context,
      }

      if (nodeKind === SyntaxKind.JsxSelfClosingElement) {
        consoleLog('<-- !!! JsxElement tag', jsxTagName)

        hierarchy.children.push(subHierarchy)

        return true
      }

      const results = (jsxElement as JsxElement).getJsxChildren().map((jsxChild, i, a) => inferJsx(subHierarchy, jsxChild, a.slice(i + 1)))

      if (results.every(x => x)) {
        consoleLog('<-- !!! JsxElement tag', jsxTagName)

        hierarchy.children.push(subHierarchy)

        return true
      }

      consoleLog('<-- ... JsxElement tag', jsxTagName, '(children inference)')

      return false
    }

    /* --
      * JsxFragment
    -- */

    if (nodeKind === SyntaxKind.JsxFragment) {
      consoleLog('--> JsxFragment')

      const jsxFragment = node as JsxFragment
      const inferred = jsxFragment.getJsxChildren().map((jsxChild, i, a) => inferJsx(hierarchy, jsxChild, a.slice(i + 1))).every(x => x)

      if (inferred) consoleLog('<-- !!! JsxFragment')
      else consoleLog('<-- ... JsxFragment (children inference)')

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

      consoleLog('--> JsxText', jsxTextValue, '~', element)

      if (!element || element.nodeType !== Node.TEXT_NODE || element.textContent?.trim() !== jsxTextValue) {
        consoleLog('<-- ... JsxText (no element or element is not text or text mismatch)')

        return false
      }

      consoleLog('<-- !!! JsxText')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

      const subHierarchy: ExtendedHierarchyType = {
        id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
        name: 'text',
        type: 'element',
        start: jsxText.getFullStart(),
        element: stackElement,
        childrenElements: [],
        childrenElementsStack: [],
        children: [],
        onFilePath: hierarchy.context.childrenOnFilePath,
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

      consoleLog('--> JsxExpression', jsxExpression.getText(), '~', element)

      if (!element) {
        consoleLog('<-- ... JsxExpression (no element)')

        return false
      }

      const inferred = inferJsx(hierarchy, expression, nextNodes)

      if (inferred) consoleLog('<-- !!! JsxExpression')
      else consoleLog('<-- ... JsxExpression (expression inference)')

      return inferred
    }

    /* --
      * ParenthesizedExpression
    -- */

    if (nodeKind === SyntaxKind.ParenthesizedExpression) {
      const parenthesizedExpression = node as ParenthesizedExpression

      consoleLog('--> ParenthesizedExpression', parenthesizedExpression.getText())

      const inferred = inferJsx(hierarchy, extractExpression(parenthesizedExpression), nextNodes)

      if (!inferred) {
        consoleLog('<-- ... ParenthesizedExpression (child inference)')

        return false
      }

      consoleLog('<-- !!! ParenthesizedExpression')

      return true
    }

    /* --
      * Identifier/PropertyAccessExpression
    -- */

    if (nodeKind === SyntaxKind.Identifier || nodeKind === SyntaxKind.PropertyAccessExpression) {

      /* --
        * children
      -- */

      if (node.getText() === 'children') {
        consoleLog('--> children')

        const subHierarchy: ExtendedHierarchyType = {
          id: `${hierarchy.id}${hierarchyIdSeparator}children${hierarchyIndexSeparator}${++childrenCount}`,
          name: 'children',
          type: 'children',
          start: node.getFullStart(),
          element: null,
          childrenElements: hierarchy.childrenElements,
          childrenElementsStack: [...hierarchy.childrenElementsStack],
          children: [],
          onFilePath: hierarchy.context.childrenOnFilePath,
          context: {
            ...hierarchy.context,
            childrenOnFilePath: parentContext?.childrenOnFilePath ?? hierarchy.context.childrenOnFilePath,
          },
        }

        hierarchy.children.push(subHierarchy)

        if (parentContext) {
          consoleGroup('CHILDREN_START, parent children:', parentContext.children.length)

          const inferreds = parentContext.children.map((jsxChild, i, a) => inferJsx(subHierarchy, jsxChild, a.slice(i + 1)))

          consoleGroupEnd()
          consoleLog('CHILDREN_END, inferreds:', inferreds.join(','))

          let inferredCount = 0

          for (const inferred of inferreds) {
            if (inferred) inferredCount++
            else break
          }

          const inferred = inferredCount > 0

          if (inferred) consoleLog('<-- !!! children')
          else consoleLog('<-- ... children (no children inference)')

          removeStackFrom(hierarchy, subHierarchy)

          subHierarchy.childrenElementsStack.length = 0

          return inferred
        }

        consoleLog('<-- !!! children (no parent context)')

        subHierarchy.childrenElementsStack.length = 0

        return true
      }

      /* --
        * JSX.Element
      -- */

      if (nodeType.getText() === 'JSX.Element') {
        consoleLog('JSX.ELEMENT, will infer from all JSX found')

        const inferredHierarchy = inferJsxs(hierarchy)

        if (inferredHierarchy) {
          consoleLog('<-- !!! JSX.Element')

          Object.assign(hierarchy, inferredHierarchy)

          return true
        }

        consoleLog('<-- ... JSX.Element (jsxs inference)')

        return false
      }

      /* --
        * Array
      -- */

      if (nodeType.isArray()) {
        consoleLog('--> Array', node.getText())
        consoleGroup('ARRAY_START')

        const mapId = createId()
        const subHierarchy: ExtendedHierarchyType = {
          id: `${hierarchy.id}${hierarchyIdSeparator}array${hierarchyIndexSeparator}${mapId}`,
          name: 'array',
          type: 'array',
          start: node.getFullStart(),
          element: null,
          childrenElements: hierarchy.childrenElements,
          childrenElementsStack: [...hierarchy.childrenElementsStack],
          children: [],
          onFilePath: hierarchy.context.childrenOnFilePath,
          context: hierarchy.context,
        }

        hierarchy.children.push(subHierarchy)

        let inferCount = 0

        while (true) {
          consoleGroup(`ARRAY_NEXT id: ${mapId}, inferCount: ${inferCount}`)

          if (!subHierarchy.childrenElementsStack[0]) break

          subHierarchy.children.push(createHierarchyFromElement(subHierarchy, subHierarchy.childrenElementsStack[0]))

          const inferredNext = inferNextJsx(subHierarchy, nextNodes)

          if (inferredNext) {
            subHierarchy.children.pop()
            break
          }
          else {
            subHierarchy.childrenElementsStack.shift()
            inferCount++
          }

          consoleGroupEnd()
        }

        consoleGroupEnd()
        consoleGroupEnd()
        consoleLog(`ARRAY_END id: ${mapId}, inferCount: ${inferCount}`)

        removeStackFrom(hierarchy, subHierarchy)

        subHierarchy.childrenElementsStack.length = 0

        if (inferCount) {
          consoleLog('<-- !!! Array')

          return true
        }

        consoleLog('<-- !!! Array (but no jsx inference)')

        return true
      }

      /* --
        * string
      -- */

      if (nodeType.isString()) {
        const element = hierarchy.childrenElementsStack[0]

        consoleLog('--> string ~', element)

        if (element.nodeType !== Node.TEXT_NODE) {
          consoleLog('<-- ... string (element is not text)')

          return false
        }

        consoleLog('<-- !!! string')

        const stackElement = hierarchy.childrenElementsStack.shift()!
        const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

        const subHierarchy: ExtendedHierarchyType = {
          id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
          name: 'text',
          type: 'element',
          start: node.getFullStart(),
          element: stackElement,
          childrenElements: [],
          childrenElementsStack: [],
          children: [],
          onFilePath: hierarchy.context.childrenOnFilePath,
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

        consoleLog('--> number ~', element)

        if (element.nodeType !== Node.TEXT_NODE || Number(element.textContent) !== Number(element.textContent)) {
          consoleLog('<-- ... number (element is not text or text is not a number)')

          return false
        }

        consoleLog('<-- !!! number')

        const stackElement = hierarchy.childrenElementsStack.shift()!
        const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

        const subHierarchy: ExtendedHierarchyType = {
          id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
          name: 'text',
          type: 'element',
          start: node.getFullStart(),
          element: stackElement,
          childrenElements: [],
          childrenElementsStack: [],
          children: [],
          onFilePath: hierarchy.context.childrenOnFilePath,
          context: hierarchy.context,
        }

        hierarchy.children.push(subHierarchy)

        return true
      }

      /* --
        * boolean/null
      -- */

      if (nodeType.isBoolean() || nodeType.isNull()) {
        consoleLog('--> boolean/null')
        consoleLog('<-- !!! boolean/null')

        return true
      }

      /* --
        * any
      -- */

      if (nodeType.isAny()) {
        consoleLog('--> any', node.getText())
        consoleGroup('ANY_START')

        const mapId = createId()
        const hierarchyClone = cloneHierarchy(hierarchy)

        let inferCount = 0

        while (true) {
          consoleGroup(`ANY_NEXT id: ${mapId}, inferCount: ${inferCount}`)

          if (!hierarchyClone.childrenElementsStack[0]) break

          hierarchyClone.children.push(createHierarchyFromElement(hierarchyClone, hierarchyClone.childrenElementsStack[0]))

          const inferredNext = inferNextJsx(hierarchyClone, nextNodes)

          if (inferredNext) {
            hierarchyClone.children.pop()
            break
          }
          else {
            hierarchyClone.childrenElementsStack.shift()
            inferCount++
          }

          consoleGroupEnd()
        }

        consoleGroupEnd()
        consoleGroupEnd()
        consoleLog(`ANY_END id: ${mapId}, inferCount: ${inferCount}`)

        if (inferCount) {
          consoleLog('<-- !!! any')

          Object.assign(hierarchy, hierarchyClone)

          return true
        }

        consoleLog('<-- !!! any (but no jsx inference)')

        return true
      }

      consoleLog('--> NON INFERRED common node:', nodeType.getText())

      return false
    }

    /* --
      * CallExpression
    -- */

    if (nodeKind === SyntaxKind.CallExpression) {
      const callExpression = node as CallExpression
      const functionName = callExpression.getExpression().getText()

      consoleLog('--> CallExpression', functionName)

      /* --
        * CallExpression .map
      -- */

      // HACK for now
      // TODO check for Array
      if (functionName.endsWith('.map')) {
        let predicate = callExpression.getArguments()[0]

        if (!predicate) {
          consoleLog('<-- ... CallExpression map (map predicate not found)')

          return false
        }

        let predicateKind = predicate.getKind()

        if (predicateKind === SyntaxKind.Identifier) {
          const predicateName = predicate.getText()
          const foundIdentifer = findClosestScopedIdentifier(hierarchy.context.identifiers.filter(x => x.name === predicateName), callExpression)

          if (!foundIdentifer) {
            consoleLog('<-- ... CallExpression map (identifer not found)', predicateName)

            return false
          }

          predicate = foundIdentifer.value
          predicateKind = predicate.getKind()
        }

        if (predicateKind === SyntaxKind.ArrowFunction || predicateKind === SyntaxKind.FunctionDeclaration) {
          const mapId = createId()

          consoleGroup(`MAP_START id: ${mapId}`)

          const returnExpressions = visitFunctionDeclaration(predicate as ArrowFunction | FunctionDeclaration)
          const jsxs = returnExpressions.reduce((jsxs, returnExpression) => ({ ...jsxs, [createId()]: returnExpression }), {})

          const subHierarchy: ExtendedHierarchyType = {
            id: `${hierarchy.id}${hierarchyIdSeparator}map${hierarchyIndexSeparator}${mapId}`,
            name: 'map',
            type: 'array',
            start: callExpression.getFullStart(),
            element: null,
            childrenElements: hierarchy.childrenElements,
            childrenElementsStack: [...hierarchy.childrenElementsStack],
            children: [],
            onFilePath: hierarchy.context.childrenOnFilePath,
            context: hierarchy.context,
          }

          hierarchy.children.push(subHierarchy)

          let inferCount = 0

          while (true) {
            consoleGroup(`MAP_NEXT id: ${mapId}, inferCount: ${inferCount}`)
            const inferredHierarchy = inferJsxs(subHierarchy, jsxs)

            if (!inferredHierarchy) break

            inferCount++

            Object.assign(subHierarchy, inferredHierarchy)

            // Historic:
            // consoleGroup(`MAP_NEXT_NEXT id: ${mapId}, inferCount: ${inferCount}`)
            // const inferredNext = inferNextJsx(subHierarchy, nextNodes)
            // consoleGroupEnd()
            // if (inferredNext) break

            consoleGroupEnd()
          }

          consoleGroupEnd()
          consoleGroupEnd()
          consoleLog(`MAP_END id: ${mapId}, inferCount: ${inferCount}`)

          if (inferCount) {
            consoleLog('<-- !!! CallExpression map')

            removeStackFrom(hierarchy, subHierarchy)

            subHierarchy.childrenElementsStack.length = 0

            return true
          }

          consoleLog('<-- !!! CallExpression map (no jsx inference)')

          return true
        }

        consoleLog('<-- ... CallExpression map (predicate kind not supported)', predicate.getKindName())

        return false
      }

      /* --
        * CallExpression function
      -- */

      const functionDeclaration = findFunctionDeclarationInParents(node, functionName)

      if (!functionDeclaration) {
        consoleLog('<-- ... CallExpression (function declaration not found)')

        return false
      }

      const returnExpressions = visitFunctionDeclaration(functionDeclaration)

      const jsxs = returnExpressions.reduce((jsxs, returnExpression) => ({ ...jsxs, [createId()]: returnExpression }), {})

      const inferredHierarchy = inferJsxs(hierarchy, jsxs)

      if (inferredHierarchy) {
        consoleLog('<-- !!! CallExpression')

        Object.assign(hierarchy, inferredHierarchy)

        return true
      }

      consoleLog('<-- ... CallExpression (jsxs inference)')

      return false
    }

    /* --
      * ConditionalExpression
    -- */

    if (nodeKind === SyntaxKind.ConditionalExpression) {
      const conditionalExpression = node as ConditionalExpression

      consoleLog('--> ConditionalExpression', conditionalExpression.getText())

      const hierarchyLeft = cloneHierarchy(hierarchy)
      const hierarchyRight = cloneHierarchy(hierarchy)
      const inferLeft = inferJsx(hierarchyLeft, conditionalExpression.getWhenTrue(), nextNodes)
      const inferRight = inferJsx(hierarchyRight, conditionalExpression.getWhenFalse(), nextNodes)

      if (!(inferLeft || inferRight)) {
        consoleLog('<-- ... ConditionalExpression (left/right inference)')

        return false
      }

      if (inferLeft) {
        consoleLog('<-- !!! ConditionalExpression left')

        Object.assign(hierarchy, hierarchyLeft)
      }
      else {
        consoleLog('<-- !!! ConditionalExpression right')

        Object.assign(hierarchy, hierarchyRight)
      }

      return true
    }

    /* --
      * StringLiteral/NumericLiteral
    -- */

    if (nodeKind === SyntaxKind.StringLiteral || nodeKind === SyntaxKind.NumericLiteral) {
      const literal = node as (StringLiteral | NumericLiteral)
      const literalValue = literal.getLiteralValue().toString()
      const element = hierarchy.childrenElementsStack[0]

      consoleLog('--> StringLiteral/NumericLiteral', literalValue, '~', element)

      if (element.nodeType !== Node.TEXT_NODE || element.textContent !== literalValue) {
        consoleLog('<-- ... StringLiteral/NumericLiteral (element is not text or text mismatch)')

        return false
      }

      consoleLog('<-- !!! StringLiteral/NumericLiteral')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

      const subHierarchy: ExtendedHierarchyType = {
        id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
        name: 'text',
        type: 'element',
        start: literal.getFullStart(),
        element: stackElement,
        childrenElements: [],
        childrenElementsStack: [],
        children: [],
        onFilePath: hierarchy.context.childrenOnFilePath,
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

      consoleLog('--> TemplateExpression', templateExpression.getText(), '~', element)

      if (element.nodeType !== Node.TEXT_NODE) {
        consoleLog('<-- ... TemplateExpression (element is not text)')

        return false
      }

      consoleLog('<-- !!! TemplateExpression')

      const stackElement = hierarchy.childrenElementsStack.shift()!
      const indexOfStackElement = hierarchy.childrenElements.indexOf(stackElement)

      const subHierarchy: ExtendedHierarchyType = {
        id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${indexOfStackElement}`,
        name: 'text',
        type: 'element',
        start: templateExpression.getFullStart(),
        element: stackElement,
        childrenElements: [],
        childrenElementsStack: [],
        children: [],
        onFilePath: hierarchy.context.childrenOnFilePath,
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

    consoleLog('--> NON INFERRED:', node.getKindName())

    return false
  }

  /* --
    * INFER NEXT JSX
  -- */

  const inferNextJsxMax = 4

  function inferNextJsx(hierarchy: ExtendedHierarchyType, nextNodes: TsNode[]) {
    let inferred = true
    let i = 0

    while (true) {
      if (!nextNodes[i]) break

      inferred = inferJsx(cloneHierarchy(hierarchy), nextNodes[i], nextNodes.slice(i + 1))

      if (!inferred) break

      i++

      if (i === inferNextJsxMax) break
    }

    return inferred
  }

  /* --
    * EXECUTION
  -- */

  consoleGroupCollapsed('HIERARCHY_TRAVERSAL_START', filePath)

  const startTime = Date.now()

  traverseImportsAndExports(sourceFile)
  traverseIdentifiers(sourceFile)
  traverseTopJsx(sourceFile)

  const hierarchy = traverseHierarchy(sourceFile)

  consoleGroupEnd()
  consoleLog('HIERARCHY_TRAVERSAL_END', filePath, Date.now() - startTime)

  // Clearing the stack to needed after a full traversal to infer the stack count of the parent component correctly
  // The remaining stack elements come from the parent's stack
  // If a hierarchy has no children then return null
  // To prevent MAP_NEXT_NEXT to infer from following component elements
  return hierarchy && hierarchy.children.length ? clearHierarchyStack(hierarchy) : null
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
      identifiers: [...hierarchy.context.identifiers],
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

function createHierarchyFromElement(hierarchy: ExtendedHierarchyType, element: HTMLElement): ExtendedHierarchyType {
  if (element.nodeType === Node.TEXT_NODE) {
    return {
      id: `${hierarchy.id}${hierarchyIdSeparator}text${hierarchyIndexSeparator}${hierarchy.childrenElements.indexOf(element)}`,
      name: 'text',
      type: 'element',
      element,
      start: -1,
      children: [],
      childrenElements: [],
      childrenElementsStack: [],
      onFilePath: hierarchy.context.childrenOnFilePath,
      context: hierarchy.context,
    }
  }

  const { tagName } = element
  const childElements: HTMLElement[] = []

  for (const child of element.childNodes) {
    childElements.push(child as HTMLElement)
  }

  const subHierarchy: ExtendedHierarchyType = {
    id: `${hierarchy.id}${hierarchyIdSeparator}${tagName}${hierarchyIndexSeparator}${hierarchy.childrenElements.indexOf(element)}`,
    name: tagName,
    type: 'element',
    element,
    start: -1,
    children: [],
    childrenElements: childElements,
    childrenElementsStack: [],
    onFilePath: hierarchy.context.childrenOnFilePath,
    context: hierarchy.context,
  }

  subHierarchy.childrenElements.forEach(childElement => {
    subHierarchy.children.push(createHierarchyFromElement(subHierarchy, childElement))
  })

  return subHierarchy
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

// function hashElement(element: HTMLElement): string {
//   if (element.nodeType === Node.TEXT_NODE) return element.textContent ?? ''

//   const childElementHashes: string[] = []

//   for (const child of element.childNodes) {
//     childElementHashes.push(hashElement(child as HTMLElement))
//   }

//   return `${element.tagName}~${hashElementAttributes(element)}~${childElementHashes.join('~~')}`
// }

// function hashElementAttributes(element: HTMLElement) {
//   const hashes: string[] = []

//   for (const attribute of element.attributes) {
//     hashes.push(`${attribute.name}~${attribute.value}`)
//   }

//   return hashes.join('~~')
// }

export default createHierarchy
