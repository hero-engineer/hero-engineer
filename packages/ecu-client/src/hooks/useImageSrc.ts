import { useEffect, useState } from 'react'

function useImageSrc(imageSrc: string, fallbackSrc: string) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
    setIsError(false)

    fetch(imageSrc)
      .then(response => {
        if (response.status === 200) setIsLoaded(true)
        else setIsError(true)
      })
  }, [imageSrc])

  return isError ? fallbackSrc : isLoaded ? imageSrc : undefined
}

export default useImageSrc
