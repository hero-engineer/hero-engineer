import { memo } from 'react'
import { Accordion, Div } from 'honorable'

import usePersistedState from '../../hooks/usePersistedState'

import ComponentTypesEditor from './ComponentTypesEditor'

// The component types section
// Displayed in the right panel
function PanelTypes() {
  const [expanded, setExpanded] = usePersistedState('component-types-accordion-expanded', true)

  return (
    <Div
      xflex="y2s"
      width={256 + 128 + 64 + 32 + 16 + 8 + 4 + 2}
    >
      <Accordion
        ghost
        expanded={expanded}
        onExpand={setExpanded}
        title="Types"
      >
        <ComponentTypesEditor />
      </Accordion>
    </Div>
  )
}

export default memo(PanelTypes)
