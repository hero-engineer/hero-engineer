import { PropsWithChildren, memo } from 'react'
import { Div } from 'honorable'

import Tabs from '../full-ast/Tabs'

import SnackBar from './SnackBar'
import EcuButton from './EcuButton'
import CreateComponentButton from './CreateComponentButton'
import ComponentsLinkButton from './ComponentsLinkButton'
import DesignLinkButton from './DesignLinkButton'
import PackagesLinkButton from './PackagesLinkButton'
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
        <Div xflex="x4s">
          <EcuButton
            borderLeft="1px solid transparent"
            borderRight="1px solid border"
          />
          <ComponentsLinkButton borderRight="1px solid border" />
          <CreateComponentButton borderRight="1px solid border" />
          <DesignLinkButton borderRight="1px solid border" />
          <PackagesLinkButton borderRight="1px solid border" />
        </Div>
        <Tabs />
        <Div flexGrow />
        <Div xflex="x6s">
          <UndoRedoButtons />
          <PushButton />
          <SettingsLinkButton borderLeft="1px solid border" />
          <ViewAppButton
            borderLeft="1px solid border"
            borderRight="1px solid transparent"
          />
        </Div>
      </Div>
      <Div
        position="relative"
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
