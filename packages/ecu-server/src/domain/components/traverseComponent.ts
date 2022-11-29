import path from 'node:path'

import {
  JSXAttribute,
  JSXElement,
  JSXIdentifier,
  StringLiteral,
} from '@babel/types'
import { NodePath } from '@babel/traverse'
import shortId from 'shortid'

import {
  FileNodeType,
  FunctionNodeType,
  HierarchyTreeType,
  ImpactedType,
  ImportsRegistry,
  IndexRegistryType,
  TraverseComponentOnSuccessType,
} from '../../types.js'
import { ecuAtoms, ecuPropName } from '../../configuration.js'

import {
  getNodeByAddress,
  getNodesByFirstNeighbourg,
  getNodesByRole,
  getNodesBySecondNeighbourg,
} from '../../graph/index.js'

import possiblyAddExtension from '../../utils/possiblyAddExtension.js'

import createHierarchyId from '../utils/createHierarchyId.js'

import traverse from '../traverse.js'

import traverseDisplayName from './traverseDisplayName.js'
import isComponentAcceptingChildren from './isComponentAcceptingChildren.js'

type TraverseComponentReturnType = {
  impacted: ImpactedType[],
  hierarchy: HierarchyTreeType | null,
}

type TraverseComponentHierarchyTreeContextType = {
  useAst?: boolean
  onComponentAddress?: string
  fileNode: FileNodeType
  paths: NodePath<JSXElement>[]
}

type TraverseComponentHierarchyTreeType = Omit<HierarchyTreeType, 'children'> & {
  context: TraverseComponentHierarchyTreeContextType
  childrenContext: null | TraverseComponentHierarchyTreeContextType
  children: TraverseComponentHierarchyTreeType[]
}

function postProcessHierarchy(hierarchy: TraverseComponentHierarchyTreeType) {
  // @ts-expect-error
  delete hierarchy.context
  // @ts-expect-error
  delete hierarchy.childrenContext

  hierarchy.children.forEach(postProcessHierarchy)
}

function traverseComponent(componentAddress: string, targetHierarchyId = '', onSuccess: TraverseComponentOnSuccessType = () => {}): TraverseComponentReturnType {
  // console.log('traverseComponent', componentAddress, hierarchyIds)

  /* --
    * PRE CHECKS
  -- */

  const rootCoomponentNode = getNodeByAddress<FunctionNodeType>(componentAddress)

  if (!rootCoomponentNode) {
    console.log(`No component node found for component ${componentAddress}`)

    return {
      impacted: [],
      hierarchy: null,
    }
  }

  const rootFileNode = getNodesBySecondNeighbourg<FileNodeType>(componentAddress, 'DeclaresFunction')[0]

  if (!rootFileNode) {
    console.log(`No file node found for component ${componentAddress}`)

    return {
      impacted: [],
      hierarchy: null,
    }
  }

  /* --
    * MEMOIZATION
  -- */

  const isComponentAcceptingChildrenMemory: Record<string, boolean> = {}

  function memoizedIsComponentAcceptingChildren(componentAddress: string, ecuAtomName = '') {
    const hash = `${componentAddress}___${ecuAtomName}`

    if (typeof isComponentAcceptingChildrenMemory[hash] === 'boolean') return isComponentAcceptingChildrenMemory[hash]

    return isComponentAcceptingChildrenMemory[hash] = isComponentAcceptingChildren(componentAddress, ecuAtomName)
  }

  const fileEmojiMemory: Record<string, string> = {}

  function memoizedFileEmoji(fileNode: FileNodeType) {
    if (typeof fileEmojiMemory[fileNode.address] === 'string') return fileEmojiMemory[fileNode.address]

    return fileEmojiMemory[fileNode.address] = fileNode.payload.emoji
  }

  /* --
    * RETURN VALUES AND STATE
  -- */

  const impacted: ImpactedType[] = [] // retval
  const rootHierarchy: TraverseComponentHierarchyTreeType = { // retval
    id: shortId(),
    context: {
      useAst: true,
      fileNode: rootFileNode,
      paths: [],
    },
    childrenContext: null,
    fileAddress: rootFileNode.address,
    fileEmoji: memoizedFileEmoji(rootFileNode),
    componentAddress: rootCoomponentNode.address,
    onComponentAddress: rootCoomponentNode.address,
    componentName: rootCoomponentNode.payload.name,
    label: rootCoomponentNode.payload.name,
    displayName: rootCoomponentNode.payload.name,
    index: 0,
    hierarchyId: '',
    isRoot: true,
    isChild: false,
    isComponentAcceptingChildren: memoizedIsComponentAcceptingChildren(rootCoomponentNode.address),
    isComponentEditable: false,
    children: [],
  }
  const componentNodes = getNodesByRole<FunctionNodeType>('Function').filter(n => n.payload.isComponent)
  const importsRegistry: ImportsRegistry = {}
  const lastingIndexRegistry: IndexRegistryType = {}

  /* --
    * HELPERS
  -- */

  function buildImportsRegistry(fileNode: FileNodeType) {
    // Build the importsRegistry for the file
    traverse(fileNode.payload.ast, {
      ImportDeclaration(x) {
        if (!importsRegistry[fileNode.address]) {
          importsRegistry[fileNode.address] = []
        }

        x.node.specifiers.forEach(specifier => {
          importsRegistry[fileNode.address].push({
            source: x.node.source.value,
            name: specifier.local.name,
            type: specifier.type,
          })
        })
      },
    })

    const importedFileNodes = getNodesByFirstNeighbourg<FileNodeType>(fileNode.address, 'ImportsFile')

    importedFileNodes.forEach(fileNode => {
      if (importsRegistry[fileNode.address]) return

      buildImportsRegistry(fileNode)
    })
  }

  function getComponentHierarchyId(jsxElement: JSXElement) {
    const jsxAttributes = jsxElement.openingElement.attributes.filter(a => a.type === 'JSXAttribute') as JSXAttribute[]

    const idIndex = jsxAttributes.findIndex(x => x.name.name === ecuPropName)

    if (!(idIndex !== -1 && jsxAttributes[idIndex].value?.type === 'StringLiteral')) return null

    const limitedHierarchyId = (jsxAttributes[idIndex].value as StringLiteral).value

    if (!limitedHierarchyId) return null

    lastingIndexRegistry[limitedHierarchyId] = lastingIndexRegistry[limitedHierarchyId] + 1 || 0

    return createHierarchyId(limitedHierarchyId, lastingIndexRegistry[limitedHierarchyId])
  }

  function getComponentFileNode(jsxElement: JSXElement, fileNode: FileNodeType) {
    const imports = importsRegistry[fileNode.address] || []

    if (!imports.length) return null

    const componentName = (jsxElement.openingElement.name as JSXIdentifier)?.name
    const relativeImportDeclaration = imports.find(x => x.name === componentName)

    if (!relativeImportDeclaration) return null

    const absolutePath = possiblyAddExtension(path.join(path.dirname(fileNode.payload.path), relativeImportDeclaration.source), fileNode.payload.extension)
    const nextComponentNode = componentNodes.find(n => n.payload.name === componentName && n.payload.path === absolutePath)

    if (!nextComponentNode) return null

    return getNodesBySecondNeighbourg<FileNodeType>(nextComponentNode.address, 'DeclaresFunction')[0]
  }

  /* --
    * DEPTH FIRST SEARCH TRAVERSAL
  -- */

  let shouldStopDfs = false

  function dfs(hierarchy: TraverseComponentHierarchyTreeType, useChildrenPath = false) {
    // console.log('-->', hierarchy.componentName, useChildrenPath ? 'children path' : '')

    if (shouldStopDfs) return

    const indexRegistry: IndexRegistryType = {}
    const { useAst, fileNode, paths } = hierarchy.context
    const hasChildrenPath = !!(useChildrenPath && hierarchy.childrenContext)
    const hasAst = !hasChildrenPath && useAst
    const ast = hasAst ? fileNode.payload.ast : null
    const path = hasAst ? null : hasChildrenPath ? hierarchy.childrenContext!.paths[0] : paths[paths.length - 1]
    const scope = hasAst ? undefined : (path as NodePath).scope
    const parentPath = hasAst ? undefined : (path as NodePath).parentPath

    if (ast && !impacted.some(x => x.fileNode.address === fileNode.address)) {
      impacted.push({ fileNode, ast })
    }

    traverse(hasAst ? ast : path?.node, {
      JSXElement(x) {
        x.skip()

        const componentName = (x.node.openingElement.name as JSXIdentifier)?.name || 'Component'
        const index = indexRegistry[componentName] = indexRegistry[componentName] + 1 || 0
        const nextPaths = [...paths, x]
        const onComponentAddress = hasChildrenPath ? hierarchy.childrenContext!.onComponentAddress! : hierarchy.componentAddress || hierarchy.onComponentAddress
        const hierarchyId = getComponentHierarchyId(x.node)

        // console.log('JSXElement', componentName)

        // hierarchyId found means we're at an ecu-client Component
        if (hierarchyId) {
          hierarchy.children.push({
            id: shortId(),
            context: {
              fileNode,
              paths: nextPaths,
            },
            childrenContext: hierarchy.childrenContext,
            fileAddress: '', // TODO: fileAddress
            fileEmoji: '',
            componentAddress: '',
            onComponentAddress,
            componentName,
            index,
            label: `${componentName}[${index}]`,
            displayName: traverseDisplayName(x),
            hierarchyId,
            isRoot: false,
            isChild: !hasAst,
            isComponentAcceptingChildren: memoizedIsComponentAcceptingChildren('', componentName),
            isComponentEditable: ecuAtoms.find(a => a.name === componentName)?.isComponentEditable ?? false,
            children: [],
          })

          if (hierarchyId === targetHierarchyId) {
            onSuccess(nextPaths)

            shouldStopDfs = true
            x.stop()
          }
        }
        else {
          const componentFileNode = getComponentFileNode(x.node, hasChildrenPath ? hierarchy.childrenContext!.fileNode : fileNode)

          if (componentFileNode) {
            const componentNode = getNodesByFirstNeighbourg<FunctionNodeType>(componentFileNode.address, 'DeclaresFunction')[0]

            if (componentNode) {
              hierarchy.children.push({
                id: shortId(),
                context: {
                  useAst: true,
                  fileNode: componentFileNode,
                  paths: nextPaths,
                },
                childrenContext: {
                  onComponentAddress,
                  fileNode: hierarchy.childrenContext?.fileNode || fileNode,
                  paths: [x],
                },
                fileAddress: componentFileNode.address,
                fileEmoji: memoizedFileEmoji(componentFileNode),
                componentAddress: componentNode.address,
                onComponentAddress,
                componentName,
                index,
                label: `${componentName}[${index}]`,
                displayName: traverseDisplayName(x),
                hierarchyId: '',
                isRoot: false,
                isChild: !hasAst,
                isComponentAcceptingChildren: memoizedIsComponentAcceptingChildren(componentNode.address),
                isComponentEditable: false,
                children: [],
              })
            }
            else {
              console.log(`No component node found for component ${componentName}`)
            }
          }
          else {
            console.log('No component file node found for', componentName)
          }
        }
      },
      JSXExpressionContainer(x) {
        if (!(x.node.expression.type === 'Identifier' && x.node.expression.name === 'children')) return
        // Prevent traversing children if on root component
        if (hierarchy.context.fileNode.address === rootFileNode.address) return

        // console.log('CHILDREN')

        dfs(hierarchy, true)
      },
    }, scope, parentPath)

    if (shouldStopDfs) return

    if (!hasChildrenPath) {
      // console.log('About to traverse children of', hierarchy.label)
      hierarchy.children.forEach(childHierarchy => {
        dfs(childHierarchy)
      })
      // console.log('End traversal of', hierarchy.label)
    }
  }

  /* --
    * EXECUTION AND RETURN
  -- */

  buildImportsRegistry(rootFileNode)
  dfs(rootHierarchy)
  postProcessHierarchy(rootHierarchy)

  // console.log('\n\n!!!!')
  // console.log('hierarchy', JSON.stringify(rootHierarchy, null, 2))

  return {
    impacted,
    hierarchy: rootHierarchy as HierarchyTreeType,
  }
}

export default traverseComponent
