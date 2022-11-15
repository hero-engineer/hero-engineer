import { Accordion } from 'honorable'

import usePersistedState from '../../hooks/usePersistedState'

import ComponentTypesEditor from './ComponentTypesEditor'

function ComponentTypesSection() {
  const [expanded, setExpanded] = usePersistedState('ecu-component-types-accordion-expanded', true)

  return (
    <Accordion
      ghost
      expanded={expanded}
      onExpand={setExpanded}
      title="Types"
    >
      <ComponentTypesEditor />
    </Accordion>
  )
}

export default ComponentTypesSection
