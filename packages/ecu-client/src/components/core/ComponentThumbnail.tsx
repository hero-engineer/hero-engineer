import { Div, Img } from 'honorable'

import Emoji from './Emoji'

type ComponentThumbnailPropsType = {
  address: string
  name: string
  emoji: string
  screenshotUrl: string
}

// A card for the components scene
function ComponentThumbnail({ address, name, emoji, screenshotUrl }: ComponentThumbnailPropsType) {
  return (
    <Div
      xflex="y2s"
      flexShrik={0}
      gap={1}
      height={256}
      maxHeight={256}
      elevation={2}
      borderRadius="large"
      p={1}
    >
      <Img
        src={screenshotUrl}
        width="100%"
        height="calc(100% - 16px - 18px)"
        objectFit="contain"
      />
      <Div
        xflex="x5"
        gap={0.5}
        height={18}
        fontWeight={500}
        textAlign="center"
        color="text"
        minWidth={0}
      >
        <Emoji emoji={emoji} />
        <Div ellipsis>
          {name}
        </Div>
      </Div>
    </Div>
  )
}

export default ComponentThumbnail
