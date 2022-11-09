import { PropsWithChildren, memo } from 'react'
import { Div, P } from 'honorable'

import ViewAppButton from './ViewAppButton'
import ComponentsLinkButton from './ComponentsLinkButton'
import AddComponentButton from './AddComponentButton'
import CreateComponentButton from './CreateComponentButton'
import DeleteComponentButton from './DeleteComponentButton'
import HierarchyBar from './HierarchyBar'
import RetractablePanel from './layout/RetractablePanel'
import TypesSection from './TypesSection'
import ComponentTypesEditor from './ComponentTypesEditor'

type OverlayProps = PropsWithChildren<any>

function Overlay({ children }: OverlayProps) {
  return (
    <Div
      xflex="y2s"
      flexGrow={1}
    >
      <Div
        xflex="y2s"
        flexShrink={0}
        backgroundColor="background-light"
      >
        <Div
          xflex="x4s"
          borderBottom="1px solid border"
        >
          <P
            xflex="x5"
            fontWeight="bold"
            borderRight="1px solid border"
            px={0.5}
          >
            Ecu
          </P>
          <ComponentsLinkButton borderRight="1px solid border" />
          <CreateComponentButton borderRight="1px solid border" />
          <DeleteComponentButton borderRight="1px solid border" />
          <AddComponentButton />
          <Div flexGrow={1} />
          <ViewAppButton borderLeft="1px solid border" />
        </Div>
        <HierarchyBar />
      </Div>
      <Div
        xflex="x1"
        flexGrow={1}
      >
        {children}
        <RetractablePanel direction="right">
          <Div minWidth={512}>
            <TypesSection />
            <ComponentTypesEditor />
          </Div>
        </RetractablePanel>
      </Div>
    </Div>
  )
}

export default memo(Overlay)
