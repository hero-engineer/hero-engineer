import { PropsWithChildren, memo } from 'react'
import { useParams } from 'react-router-dom'
import { Div, P } from 'honorable'
import { RiNodeTree } from 'react-icons/ri'
import { BiNetworkChart } from 'react-icons/bi'
import { CgInsertBeforeR } from 'react-icons/cg'

import ComponentsLinkButton from './ComponentsLinkButton'
import CreateComponentButton from './CreateComponentButton'
import DeleteComponentButton from './DeleteComponentButton'
import ViewAppButton from './ViewAppButton'
import UndoRedoButtons from './UndoRedoButtons'
import PushButton from './PushButton'
import RetractablePanel from './RetractablePanel'
import HierarchySection from './HierarchySection'
import AddComponentSection from './AddComponentSection'
import ComponentTypesSection from './ComponentTypesSection'
import ComponentImportsSection from './ComponentImportsSection'

type OverlayPropsType = PropsWithChildren<any>

function Overlay({ children }: OverlayPropsType) {
  const { componentAddress = '' } = useParams()

  return (
    <>
      <Div
        xflex="x4s"
        flexShrink={0}
        backgroundColor="background-light"
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
            defaultOpenIndex={0}
            openPersistedStateKey="ecu-left-panel-open"
            items={[
              {
                label: 'Hierarchy',
                icon: <RiNodeTree />,
                children: <HierarchySection />,
              },
              {
                label: 'Insert component',
                icon: <CgInsertBeforeR />,
                children: <AddComponentSection />,
              },
            ]}
          />
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
            defaultOpenIndex={0}
            openPersistedStateKey="ecu-right-panel-open"
            items={[
              {
                label: 'Imports, types and styles',
                icon: <BiNetworkChart />,
                children: (
                  <Div minWidth={512}>
                    <ComponentImportsSection />
                    <ComponentTypesSection />
                  </Div>
                ),
              },
            ]}
          />
        )}
      </Div>
    </>
  )
}

export default memo(Overlay)
