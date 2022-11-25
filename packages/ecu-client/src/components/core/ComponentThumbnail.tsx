import { Div, Img } from 'honorable'
import { SyntheticEvent, useCallback } from 'react'

import Emoji from './Emoji'

type ComponentThumbnailPropsType = {
  address: string
  name: string
  emoji: string
}

// A card for the components scene
function ComponentThumbnail({ address, name, emoji }: ComponentThumbnailPropsType) {
  const handleImageError = useCallback((event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (event.currentTarget.src !== 'http://localhost:4001/.ecu/component.svg') {
      event.currentTarget.src = 'http://localhost:4001/.ecu/component.svg'
    }
  }, [])

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
        src={`http://localhost:4001/.ecu/screenshots/${address}.png`}
        width="100%"
        height="calc(100% - 16px - 18px)"
        objectFit="contain"
        onError={handleImageError}
      />
      <Div
        xflex="x5"
        gap={0.5}
        height={18}
        fontWeight={500}
        textAlign="center"
        color="text"
      >
        <Emoji emoji={emoji} />
        {name}
      </Div>
    </Div>
  )
}

export default ComponentThumbnail
