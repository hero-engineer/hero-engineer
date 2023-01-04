import { Div, H1 } from 'honorable'

import PackagesLinkButton from '~components/scene-home/PackagesLinkButton'

// Home scene
function Home() {
  return (
    <>
      <H1 mb={2}>Hero Engineer home</H1>
      <Div>
        <PackagesLinkButton />
      </Div>
    </>
  )
}

export default Home
