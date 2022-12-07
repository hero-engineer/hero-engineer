import { memo } from 'react'
import { Accordion, Div } from 'honorable'

import usePersistedState from '@hooks/usePersistedState'

import ComponentImportsEditor from './ComponentImportsEditor'

// Component imports section
// Displayed in the right panel
function PanelImports() {
  const [expanded, setExpanded] = usePersistedState('component-imports-accordion-expanded', true)

  return (
    <Div
      xflex="y2s"
      width={256 + 128 + 64 + 32 + 16 + 8 + 4 + 2}
    >
      <Accordion
        ghost
        expanded={expanded}
        onExpand={setExpanded}
        title="Imports"
      >
        <ComponentImportsEditor />
      </Accordion>
    </Div>
  )
}

export default memo(PanelImports)
