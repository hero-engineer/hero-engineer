import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react'
import { Button, Div, H1, Img } from 'honorable'

import { refetchKeys } from '@constants'

import { FaviconQuery, FaviconQueryDataType, UpdateFaviconMutation, UpdateFaviconMutationDataType, UploadFileMutation, UploadFileMutationDataType } from '@queries'

import useQuery from '@hooks/useQuery'
import useMutation from '@hooks/useMutation'
import useRefetch from '@hooks/useRefetch'

// Design/favicon scene
function DesignFavicon() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)

  const [faviconQueryResult, refetchFaviconQuery] = useQuery<FaviconQueryDataType>({
    query: FaviconQuery,
  })
  const [, uploadFile] = useMutation<UploadFileMutationDataType>(UploadFileMutation)
  const [, updateFavicon] = useMutation<UpdateFaviconMutationDataType>(UpdateFaviconMutation)

  useRefetch({
    key: refetchKeys.favicon,
    refetch: refetchFaviconQuery,
  })

  const faviconUrl = useMemo(() => faviconQueryResult.data?.favicon, [faviconQueryResult.data])

  const handleUploadClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    setIsLoading(true)

    const response = await uploadFile({
      file: event.target.files[0],
      fileName: event.target.files[0].name,
    })

    if (!response.data?.uploadFile) {
      setIsLoading(false)

      return
    }

    await updateFavicon({
      url: response.data.uploadFile,
    })

    // No need to refetch favicon query, because vitejs will reload the page
    setIsLoading(false)
  }, [uploadFile, updateFavicon])

  const renderFavicon = useCallback(() => {
    if (faviconUrl) {
      return (
        <Div
          xflex="x4"
          gap={1}
        >
          Current favicon:
          <Div
            xflex="x5"
            backgroundColor="white"
            borderRadius="medium"
            elevation={1}
            p={0.5}
          >
            <Img
              src={faviconUrl}
              width={16}
            />
          </Div>
        </Div>
      )
    }

    return (
      <Div>
        You have no favicon for your app.
      </Div>
    )
  }, [faviconUrl])

  const renderFaviconUploadButton = useCallback(() => (
    <>
      <Button
        onClick={handleUploadClick}
        loading={isLoading}
      >
        Upload favicon
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  ), [isLoading, handleUploadClick, handleFileChange])

  return (
    <>
      <H1 mb={2}>Favicon</H1>
      <Div
        xflex="y1"
        gap={1}
        pb={6}
      >
        {!faviconQueryResult.fetching && renderFavicon()}
        {!faviconQueryResult.fetching && renderFaviconUploadButton()}
      </Div>
    </>
  )
}

export default DesignFavicon
