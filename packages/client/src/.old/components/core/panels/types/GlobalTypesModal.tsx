import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Div, H3, Input, Modal } from 'honorable'

import { GlobalTypesQuery, GlobalTypesQueryDataType, UpdateGlobalTypesMutation, UpdateGlobalTypesMutationDataType } from '~queries'

import GlobalTypesContext from '~contexts/GlobalTypesContext'

import useQuery from '~hooks/useQuery'
import useMutation from '~hooks/useMutation'

type GlobalTypesModalPropsType = {
  open: boolean
  onClose: () => void
}

// The global types modal
function GlobalTypesModal({ open, onClose }: GlobalTypesModalPropsType) {
  const { setGlobalTypes } = useContext(GlobalTypesContext)
  const [content, setContent] = useState('')

  const [globalTypesQueryResult, refetchGlobalTypes] = useQuery<GlobalTypesQueryDataType>({
    query: GlobalTypesQuery,
  })
  const [, updateGlobalTypes] = useMutation<UpdateGlobalTypesMutationDataType>(UpdateGlobalTypesMutation)

  const globalTypesFileContent = useMemo(() => globalTypesQueryResult.data?.globalTypes.globalTypesFileContent ?? '', [globalTypesQueryResult.data])

  const handleSave = useCallback(async () => {
    await updateGlobalTypes({
      globalTypesFileContent: content,
    })

    onClose()
  }, [updateGlobalTypes, content, onClose])

  useEffect(() => {
    setContent(globalTypesFileContent)
  }, [globalTypesFileContent])

  return (
    <Modal
      open={open}
      onClose={onClose}
      minWidth={512}
    >
      <H3>Global types</H3>
      <Input
        multiline
        width="100%"
        minRows={3}
        value={content}
        onChange={event => setContent(event.target.value)}
        mt={2}
      />
      <Div
        xflex="x6"
        gap={0.5}
        mt={2}
      >
        <Button
          secondary
          onClick={onClose}
        >
          Discard and close
        </Button>
        <Button onClick={handleSave}>
          Save and close
        </Button>
      </Div>
    </Modal>
  )
}

export default GlobalTypesModal
