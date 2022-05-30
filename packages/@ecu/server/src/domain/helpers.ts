import path from 'path'

import { Project, SourceFile, SyntaxKind } from 'ts-morph'
import { ESLint } from 'eslint'

import configuration from '../configuration'

export function getAppLocations() {
  const appRootLocation = path.join(configuration.rootPath, configuration.appRoot)
  const appTsxLocation = path.join(appRootLocation, 'src/App.tsx')

  return {
    appRootLocation,
    appTsxLocation,
  }
}

export function getAppSourceAndHierarchy() {
  const { appRootLocation, appTsxLocation } = getAppLocations()

  const project = new Project({
    tsConfigFilePath: path.join(appRootLocation, 'tsconfig.json'),
  })

  const AppSource = project.getSourceFile(appTsxLocation)
  const AppFunction = AppSource.getFunction('App')
  const returnStatement = AppFunction.getLastChild().getChildrenOfKind(SyntaxKind.ReturnStatement)[0]

  if (!returnStatement) {
    throw new Error('No return statement in App.tsx')
  }

  const EcuTag = returnStatement.getDescendantsOfKind(SyntaxKind.JsxElement)[0]

  if (!(EcuTag && EcuTag.getChildAtIndex(0).getChildAtIndex(1).getText() === 'Ecu')) {
    throw new Error('No Ecu tag in App.tsx')
  }

  return {
    AppSource,
    EcuTag,
  }
}

export async function saveAppSource(AppSource: SourceFile) {
  await AppSource.save()

  const eslint = new ESLint({ fix: true })
  const results = await eslint.lintFiles([getAppLocations().appTsxLocation])

  await ESLint.outputFixes(results)
}
