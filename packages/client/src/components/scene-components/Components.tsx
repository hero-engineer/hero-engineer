import { H1 } from 'honorable'

import FilesTree from '~components/scene-components/FilesTree'

const filterComponents = (relativePath: string) => relativePath.endsWith('.tsx') && !relativePath.startsWith('decorators/') && relativePath !== 'main.tsx'

function Components() {
  return (
    <>
      <H1 mb={2}>Components</H1>
      <FilesTree filter={filterComponents} />
    </>
  )
}

export default Components
