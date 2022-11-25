import { PropsWithChildren, memo, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Div } from 'honorable'
import { RiNodeTree } from 'react-icons/ri'
import { BiNetworkChart } from 'react-icons/bi'
import { CgInsertBeforeR } from 'react-icons/cg'
import { MdBrush } from 'react-icons/md'
import { BsDiamond } from 'react-icons/bs'

import BreakpointContext from '../../contexts/BreakpointContext'

import SnackBar from './SnackBar'
import HierarchyBar from './HierarchyBar'
import EcuButton from './EcuButton'
import ComponentsLinkButton from './ComponentsLinkButton'
import CreateComponentButton from './CreateComponentButton'
import PackagesLinkButton from './PackagesLinkButton'
import BreakpointsButtons from './BreakpointsButtons'
import UndoRedoButtons from './UndoRedoButtons'
import PushButton from './PushButton'
import ViewAppButton from './ViewAppButton'
import RetractablePanel from './RetractablePanel'
import HierarchySection from './HierarchySection'
import AddComponentSection from './AddComponentSection'
import ComponentMetadataSection from './ComponentMetadataSection'
import ComponentTypesSection from './ComponentTypesSection'
import ComponentImportsSection from './ComponentImportsSection'
import StylesSection from './StylesSection'
import WidthBar from './WidthBar'

type OverlayPropsType = PropsWithChildren<any>

// The whole ecu overlay
function Overlay({ children }: OverlayPropsType) {
  const { componentAddress = '' } = useParams()
  const { isDragging } = useContext(BreakpointContext)

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
        <PackagesLinkButton borderRight="1px solid border" />
        <Div flexGrow />
        <BreakpointsButtons />
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
          flexGrow
          maxHeight="100%"
          overflowY="hidden"
        >
          {children}
          {isDragging ? <WidthBar /> : <HierarchyBar />}
        </Div>
        {!!componentAddress && (
          <RetractablePanel
            direction="right"
            openPersistedStateKey="ecu-right-panel-open"
            items={[
              {
                label: 'Component',
                icon: <BsDiamond />,
                children: <ComponentMetadataSection />,
              },
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
      <SnackBar />
    </>
  )
}

export default memo(Overlay)
