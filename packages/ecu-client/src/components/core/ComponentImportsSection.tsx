import { Accordion } from 'honorable'

import usePersistedState from '../../hooks/usePersistedState'

import ComponentImportsEditor from './ComponentImportsEditor'

function ComponentImportsSection() {
  const [expanded, setExpanded] = usePersistedState('ecu-component-imports-accordion-expanded', true)

  return (
    <Accordion
      ghost
      expanded={expanded}
      onExpand={setExpanded}
      title="Imports"
    >
      <ComponentImportsEditor />
    </Accordion>
  )
}

export default ComponentImportsSection
