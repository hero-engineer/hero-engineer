import { memo } from 'react'
import { Div, P } from 'honorable'

import ComponentsLinkButton from './ComponentsLinkButton'
import AddComponentButton from './AddComponentButton'
import CreateComponentButton from './CreateComponentButton'
import DeleteComponentButton from './DeleteComponentButton'
import HierarchyBar from './HierarchyBar'

function Overlay() {
  return (
    <Div
      p={0.5}
      backgroundColor="background-light"
    >
      <Div
        xflex="x4"
        gap={0.5}
      >
        <P fontWeight="bold">
          Ecu
        </P>
        <ComponentsLinkButton />
        <CreateComponentButton />
        <DeleteComponentButton />
        <AddComponentButton />
      </Div>
      <HierarchyBar />
    </Div>
  )
}

export default memo(Overlay)
