import { PropsWithChildren, memo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'
import { RiNodeTree } from 'react-icons/ri'
import { BiNetworkChart } from 'react-icons/bi'
import { CgInsertBeforeR } from 'react-icons/cg'
import { MdBrush } from 'react-icons/md'

import useClearHierarchyIdsAndComponentDeltaOnClick from '../../hooks/useClearHierarchyIdsAndComponentDeltaOnClick'

import EcuButton from './EcuButton'
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
import StylesSection from './StylesSection'

type OverlayPropsType = PropsWithChildren<any>

function Overlay({ children }: OverlayPropsType) {
  const { componentAddress = '' } = useParams()
  const childrenRef = useRef<HTMLDivElement>(null)

  useClearHierarchyIdsAndComponentDeltaOnClick(childrenRef)

  return (
    <>
      <Div
        xflex="x4s"
        flexShrink={0}
        backgroundColor="background-light"
        borderBottom="1px solid border"
      >
        <EcuButton borderRight="1px solid border" />
        <ComponentsLinkButton borderRight="1px solid border" />
        <CreateComponentButton borderRight="1px solid border" />
        <DeleteComponentButton borderRight="1px solid border" />
        <Div flexGrow />
        <UndoRedoButtons />
        <PushButton />
        <ViewAppButton borderLeft="1px solid border" />
      </Div>
      <Div
        xflex="x4s"
        flexGrow
        height="calc(100vh - 32px)"
        maxHeight="calc(100vh - 32px)"
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
          ref={childrenRef}
          xflex="y2s"
          flexGrow
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
                label: 'Imports and types',
                icon: <BiNetworkChart />,
                children: (
                  <Div minWidth={512}>
                    <ComponentImportsSection />
                    <ComponentTypesSection />
                  </Div>
                ),
              },
              {
                label: 'Styles',
                icon: <MdBrush />,
                children: <StylesSection />,
              },
            ]}
          />
        )}
      </Div>
    </>
  )
}

export default memo(Overlay)
