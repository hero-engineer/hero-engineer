import { PropsWithChildren, memo } from 'react'
import { Div } from 'honorable'

import SnackBar from './SnackBar'
import EcuButton from './EcuButton'
import ComponentsLinkButton from './ComponentsLinkButton'
import CreateComponentButton from './CreateComponentButton'
import DesignLinkButton from './DesignLinkButton'
import PackagesLinkButton from './PackagesLinkButton'
import LastEditedComponentButton from './LastEditedComponentButton'
import BreakpointsButtons from './BreakpointsButtons'
import InteractiveModeButton from './InteractiveModeButton'
import UndoRedoButtons from './UndoRedoButtons'
import PushButton from './PushButton'
import SettingsLinkButton from './SettingsLinkButton'
import ViewAppButton from './ViewAppButton'

type OverlayPropsType = PropsWithChildren<any>

// The whole ecu overlay
function Overlay({ children }: OverlayPropsType) {
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
        <DesignLinkButton borderRight="1px solid border" />
        <PackagesLinkButton borderRight="1px solid border" />
        <LastEditedComponentButton borderRight="1px solid border" />
        <Div width={32} />
        <Div flexGrow />
        <BreakpointsButtons />
        <Div flexGrow />
        <InteractiveModeButton borderLeft="1px solid border" />
        <UndoRedoButtons />
        <PushButton />
        <SettingsLinkButton borderLeft="1px solid border" />
        <ViewAppButton borderLeft="1px solid border" />
      </Div>
      <Div
        xflex="y2s"
        flexGrow
        height="calc(100vh - 32px)"
        maxHeight="calc(100vh - 32px)"
        overflowY="hidden"
      >
        {children}
      </Div>
      <SnackBar />
    </>
  )
}

export default memo(Overlay)
