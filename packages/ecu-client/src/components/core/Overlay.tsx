import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Div } from 'honorable'

import HierarchyBar from './HierarchyBar'
import CreateComponentButton from './CreateComponentButton'
import AddComponentButton from './AddComponentButton'
import DeleteComponentButton from './DeleteComponentButton'

function Overlay() {
  return (
    <>
      <Div
        xflex="x4"
        gap={1}
      >
        <Link to="/__ecu__/components">
          Components
        </Link>
        <CreateComponentButton />
        <AddComponentButton />
        <DeleteComponentButton />
      </Div>
      <HierarchyBar />
    </>
  )
}

export default memo(Overlay)
