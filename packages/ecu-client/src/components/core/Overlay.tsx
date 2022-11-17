import { PropsWithChildren, memo } from 'react'
import { useParams } from 'react-router-dom'
import { Div, P } from 'honorable'
import { BiNetworkChart } from 'react-icons/bi'
import { TbRowInsertBottom } from 'react-icons/tb'

import ViewAppButton from './ViewAppButton'
import UndoRedoButtons from './UndoRedoButtons'
import PushButton from './PushButton'
import ComponentsLinkButton from './ComponentsLinkButton'
import CreateComponentButton from './CreateComponentButton'
import DeleteComponentButton from './DeleteComponentButton'
import HierarchyBar from './HierarchyBar'
import RetractablePanel from './RetractablePanel'
import AddComponentSection from './AddComponentSection'
import ComponentTypesSection from './ComponentTypesSection'
import ComponentImportsSection from './ComponentImportsSection'

type OverlayProps = PropsWithChildren<any>

function Overlay({ children }: OverlayProps) {
  const { componentAddress = '' } = useParams()

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
          <PushButton />
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
        {!!componentAddress && (
          <RetractablePanel
            direction="left"
            openLabel="Insert component"
            openIcon={<TbRowInsertBottom />}
            openPersistedStateKey="ecu-add-component-panel-open"
          >
            <AddComponentSection />
          </RetractablePanel>
        )}
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
        {!!componentAddress && (
          <RetractablePanel
            direction="right"
            openLabel="Imports, types and styles"
            openIcon={<BiNetworkChart />}
            openPersistedStateKey="ecu-types-panel-open"
          >
            <Div minWidth={512}>
              <ComponentImportsSection />
              <ComponentTypesSection />
            </Div>
          </RetractablePanel>
        )}
      </Div>
    </>
  )
}

export default memo(Overlay)
