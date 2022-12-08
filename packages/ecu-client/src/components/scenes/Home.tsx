import { H1 } from 'honorable'

import FilesTree from '~core/full-ast/FilesTree'

// Home scene
function Home() {
  return (
    <>
      <H1 mb={2}>Ecu home</H1>
      <FilesTree />
    </>
  )
}

export default Home
