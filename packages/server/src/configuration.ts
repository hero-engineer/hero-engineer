import path from 'node:path'

import { BreakpointType } from './types.js'

export const appPath = path.join(process.cwd(), 'app')

// export const ecuPackageName = 'hero-engineer'

// export const ecuPropName = 'data-hero-engineer'

export const commitPrefix = '[hero-engineer] '

export const initialCommitMessage = 'Create Hero Engineer project'

export const heroEngineerRelativePath = '.hero-engineer'

// export const ecuScreenshotsRelativePath = 'screenshots'

// export const ecuGraphFileName = 'graph.json'

export const historyFileName = 'history.json'

export const breakpointsFileName = 'breakpoints.json'

// export const globalTypesFileRelativePath = 'src/types.ts'

// export const indexCssFileRelativePath = 'src/index.css'

// export const allowedExtensions = ['ts', 'tsx', 'css']

export const decoratorsRelativePath = 'src/decorators'

export const decoratorNameSuffix = 'Decorator'

export const commonDecoratorName = 'HeroEngineerDecorator'

// export const ecuFileIdCommentPrefix = 'hero-engineer-file-id'

// export const ecuFunctionIdCommentPrefix = 'hero-engineer-function-id'

// export const ecuDisplayNameCommentPrefix = 'hero-engineer-display-name'

// TODO use a regex
export const faviconStartComment = '<!-- FAVICON START -->'

export const faviconEndComment = '<!-- FAVICON END -->'

// export const globalTypesFileBegginingComment = `/* ---
//   Please do not delete this file
//   as it is needed by the Hero Engineer core engine
// --- */`

// export const importsStartComment = `/* --
//   * IMPORTS START
// -- */`

// export const importsEndComment = `/* --
//   * IMPORTS END
// -- */`

// export const typesStartComment = `/* --
//   * TYPES START
// -- */`

// export const typesEndComment = `/* --
//   * TYPES END
// -- */`

// export const emojiStartComment = `/* --
//   * EMOJI START
// -- */`

// export const emojiEndComment = `/* --
//   * EMOJI END
// -- */`

// export const descriptionStartComment = `/* --
//   * DESCRIPTION START
// -- */`

// export const descriptionEndComment = `/* --
//   * DESCRIPTION END
// -- */`

// export const fontsStartComment = `/* --
//   * FONTS START
// -- */`

// export const fontsEndComment = `/* --
//   * FONTS END
// -- */`

// export const colorsStartComment = `/* --
//   * COLORS START
// -- */`

// export const colorsEndComment = `/* --
//   * COLORS END
// -- */`

// export const spacingsStartComment = `/* --
//   * SPACINGS START
// -- */`

// export const spacingsEndComment = `/* --
//   * SPACINGS END
// -- */`

// export const rootCssStartComment = `/* --
//   * ROOT CSS START
// -- */`

// export const rootCssEndComment = `/* --
//   * ROOT CSS END
// -- */`

// export const externalModulesImports: ImportType[] = [
//   {
//     name: 'PropsWithChildren',
//     source: 'react',
//     type: 'ImportSpecifier',
//   },
//   {
//     name: 'ReactNode',
//     source: 'react',
//     type: 'ImportSpecifier',
//   },
// ]

// export const ecuAtomPrefix = '__ecu_atom__'

// export const ecuAtoms: AtomType[] = [
//   {
//     id: `${ecuAtomPrefix}Div`,
//     name: 'Div',
//     defaultClassName: 'div-remove-me',
//     isComponentAcceptingChildren: true,
//     isComponentEditable: false,
//     defaultChildren: [],
//   },
//   {
//     id: `${ecuAtomPrefix}Text`,
//     name: 'Text',
//     defaultClassName: '',
//     isComponentAcceptingChildren: false,
//     isComponentEditable: true,
//     defaultChildren: [jsxText("Edit me I'm a Text")],
//   },
// ]

export const defaultBreakpoint: BreakpointType = {
  id: 'Default',
  name: 'Default',
  base: 1232,
  min: 0,
  max: Infinity,
  scale: 1,
  media: '',
}
