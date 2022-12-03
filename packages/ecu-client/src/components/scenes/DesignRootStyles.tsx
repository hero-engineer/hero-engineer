import { useCallback, useState } from 'react'
import { Div, H1 } from 'honorable'

import CssFunctionEditor from '../core/CssFunctionEditor'

const baseRootStyles = `html {
  color: var(--color-16773572549573434);
  background-color: var(--color-16773572549573434);
}`

// Design/root-styles scene
function DesignRootStyles() {
  const [rootStyles, setRootStyles] = useState(baseRootStyles)

  const handleCssFunctionChange = useCallback((value: string) => {
    setRootStyles(value)
  }, [])

  return (
    <>
      <H1 mb={2}>Root Styles</H1>
      <Div
        xflex="y2s"
        gap={2}
        pb={6}
      >
        <CssFunctionEditor
          value={rootStyles}
          onChange={handleCssFunctionChange}
        />
      </Div>
    </>
  )
}

export default DesignRootStyles
