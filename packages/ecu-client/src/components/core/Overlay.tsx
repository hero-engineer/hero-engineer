import { PropsWithChildren, memo } from 'react'
import { Div, P } from 'honorable'

import ViewAppButton from './ViewAppButton'
import UndoRedoButtons from './UndoRedoButtons'
import ComponentsLinkButton from './ComponentsLinkButton'
import CreateComponentButton from './CreateComponentButton'
import DeleteComponentButton from './DeleteComponentButton'
import HierarchyBar from './HierarchyBar'
import RetractablePanel from './layout/RetractablePanel'
import TypesSection from './TypesSection'
import ComponentTypesEditor from './ComponentTypesEditor'
import ComponentImportsEditor from './ComponentImportsEditor'
import AddComponentSection from './AddComponentSection'

type OverlayProps = PropsWithChildren<any>

function Overlay({ children }: OverlayProps) {
  return (
    <>
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
          <Div flexGrow={1} />
          <UndoRedoButtons />
          <ViewAppButton borderLeft="1px solid border" />
        </Div>
        <HierarchyBar />
      </Div>
      <Div
        xflex="x1"
        flexGrow={1}
        height="calc(100vh - 64px)"
        maxHeight="calc(100vh - 64px)"
        overflow="hidden"
      >
        <RetractablePanel
          defaultOpen
          direction="left"
        >
          <AddComponentSection />
        </RetractablePanel>
        <Div
          xflex="y2s"
          flexGrow={1}
          maxHeight="100%"
          overflowY="auto"
          py={0.5}
          px={2.5}
        >
          {children}
        </Div>
        <RetractablePanel
          defaultOpen
          direction="right"
        >
          <Div minWidth={512}>
            <ComponentImportsEditor />
            <TypesSection />
            <ComponentTypesEditor />
          </Div>
        </RetractablePanel>
      </Div>
    </>
  )
}

export default memo(Overlay)
