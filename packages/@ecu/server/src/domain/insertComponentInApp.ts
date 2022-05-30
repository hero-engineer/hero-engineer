import { Node, SourceFile, SyntaxKind } from 'ts-morph'

import {
  getAppSourceAndHierarchy,
  saveAppSource,
} from './helpers'

async function insertComponentInApp(name: string, index: string) {
  const { AppSource, EcuTag } = getAppSourceAndHierarchy()

  insertImportStatement(AppSource, name)
  insertComponentInHierarchy(EcuTag, name, index)

  console.log('\n---\n')
  console.log(AppSource.getText())
  console.log('\n---\n')

  await saveAppSource(AppSource)
}

async function insertImportStatement(AppSource: SourceFile, name: string) {
  for (const xImport of AppSource.getImportDeclarations()) {
    const names = [xImport.getDefaultImport(), ...xImport.getNamedImports()]
      .filter(x => x)
      .map(x => x.getText())

    if (names.indexOf(name) !== -1) {
      return
    }
  }

  const comments = AppSource.getStatementsWithComments()

  if (comments.length === 0) {
    throw new Error('No ecu comments found in App.tsx')
  }

  comments.forEach(comment => {
    if (comment.getText().includes('ecu-imports')) {
      AppSource.insertImportDeclaration(comment.getChildIndex() + 1, {
        defaultImport: name,
        moduleSpecifier: `./components/${name}`,
      })
    }
  })
}

const jsxTagRegexp = /^<\/?([a-zA-Z0-9-_]+)/

type InsertComponentInHierarchyRetval = {
  found: boolean
  indexDiff?: number[]
}

function insertComponentInHierarchy(node: Node, name: string, targetIndex: string, currentIndex = ''): InsertComponentInHierarchyRetval {
  // console.log('\ninsertComponentInHierarchy index:', currentIndex, typeof currentIndex, '\n', node.getFullText())

  let currentIndexDiff: number[] = []
  const kind = node.getKind()

  if (kind === SyntaxKind.JsxOpeningElement) {
    currentIndexDiff = [0, 0]

    // console.log(node.getKindName(), node.getText())

    const tagName = node.getText().match(jsxTagRegexp)[1]

    if (currentIndex === targetIndex) {
      node.replaceWithText(`<${tagName}>\n<${name} />`)

      return { found: true }
    }
  }

  if (kind === SyntaxKind.JsxClosingElement) {
    currentIndexDiff = [null]

    // console.log(node.getKindName(), node.getText())

    // const tagName = node.getText().match(jsxTagRegexp)[1]

    // if (currentIndex === targetIndex) {
    //   node.replaceWithText(`<${name} />\n</${tagName}>`)

    //   return { found: true }
    // }
  }

  if (kind === SyntaxKind.JsxSelfClosingElement) {
    currentIndexDiff = [1]

    // console.log(node.getKindName(), node.getText())

    const tagName = node.getText().match(jsxTagRegexp)[1]

    if (currentIndex === targetIndex) {
      node.replaceWithText(`<${name} />\n<${tagName} />`)

      return { found: true }
    }

    if (applyIndexDiff(currentIndex, [0, 0]) === targetIndex) {
      node.replaceWithText(`<${tagName}>\n<${name} />\n</${tagName}>`)

      return { found: true }
    }

    if (applyIndexDiff(currentIndex, currentIndexDiff) === targetIndex) {
      node.replaceWithText(`<${tagName} />\n<${name} />`)

      return { found: true }
    }
  }

  let nextIndex = applyIndexDiff(currentIndex, currentIndexDiff)

  // console.log('nextIndex', nextIndex)

  for (const child of node.getChildren()) {
    const { found, indexDiff } = insertComponentInHierarchy(child, name, targetIndex, nextIndex)

    if (found) {
      return { found }
    }

    nextIndex = applyIndexDiff(nextIndex, indexDiff)
  }

  return { found: false, indexDiff: currentIndexDiff }
}

function applyIndexDiff(index: string, indexDiff: number[]) {
  if (indexDiff.length === 0) return index

  const indexArray = index.split('.').map(x => parseInt(x)).filter(x => x === x)
  const lastIndex = indexArray.pop()

  if (indexDiff[0] === null) return indexArray.join('.')

  indexArray.push((lastIndex || 0) + indexDiff[0])

  for (let i = 1; i < indexDiff.length; i++) {
    indexArray.push(indexDiff[i])
  }

  return indexArray.join('.')
}

// insertComponentInApp('Cool', '0.0')

export default insertComponentInApp
