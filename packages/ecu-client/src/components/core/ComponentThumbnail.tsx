import { Div, Img } from 'honorable'
import { ReactEventHandler, SyntheticEvent, useCallback } from 'react'

type ComponentThumbnailPropsType = {
  address: string
  name: string
}

function ComponentThumbnail({ address, name }: ComponentThumbnailPropsType) {
  const handleImageError = useCallback((event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = 'http://localhost:4001/component.svg'
  }, [])

  return (
    <Div
      xflex="y2s"
      flexShrik={0}
      gap={1}
      width={256}
      height={256}
      maxHeight={256}
      elevation={1}
      borderRadius="large"
      p={1}
    >
      <Img
        src={`http://localhost:4001/screenshots/${address}.png`}
        width="100%"
        height="calc(100% - 16px - 18px)"
        objectFit="contain"
        onError={handleImageError}
      />
      <Div
        height={18}
        fontWeight={500}
        textAlign="center"
        color="text"
      >
        {name}
      </Div>
    </Div>
  )
}

export default ComponentThumbnail
