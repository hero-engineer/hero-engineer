import { PropsWithChildren, memo } from 'react'
import { Div } from 'honorable'

import Tabs from '~components/layout/Tabs'
import SnackBar from '~components/overlay/SnackBar'
import HeroEngineerButton from '~components/overlay/HeroEngineerButton'
import CreateComponentButton from '~components/overlay/CreateComponentButton'
import ComponentsLinkButton from '~components/overlay/ComponentsLinkButton'
import DesignLinkButton from '~components/overlay/DesignLinkButton'
import PackagesLinkButton from '~components/overlay/PackagesLinkButton'
import UndoRedoButtons from '~components/overlay/UndoRedoButtons'
import PushButton from '~components/overlay/PushButton'
import SettingsLinkButton from '~components/overlay/SettingsLinkButton'
import ViewAppButton from '~components/overlay/ViewAppButton'

type OverlayPropsType = PropsWithChildren<any>

// The whole Hero Engineer overlay
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
          <HeroEngineerButton
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
