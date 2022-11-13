import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { Button, Div, H3, Input, Modal } from 'honorable'

import GlobalTypesContext from '../../contexts/GlobalTypesContext'

import { GlobalTypesQuery, GlobalTypesQueryDataType, WriteGlobalTypesMutation, WriteGlobalTypesMutationDataType } from '../../queries'

type GlobalTypesModalProps = {
  open: boolean
  onClose: () => void
}

function GlobalTypesModal({ open, onClose }: GlobalTypesModalProps) {
  const { setGlobalTypes } = useContext(GlobalTypesContext)
  const [content, setContent] = useState('')

  const [globalTypesQueryResult, refetchGlobalTypes] = useQuery<GlobalTypesQueryDataType>({
    query: GlobalTypesQuery,
  })
  const [, writeGlobalTypes] = useMutation<WriteGlobalTypesMutationDataType>(WriteGlobalTypesMutation)

  const globalTypesFileContent = useMemo(() => globalTypesQueryResult.data?.globalTypes.globalTypesFileContent ?? '', [globalTypesQueryResult.data])

  const handleSave = useCallback(async () => {
    await writeGlobalTypes({
      globalTypesFileContent: content,
    })

    onClose()
  }, [writeGlobalTypes, content, onClose])

  useEffect(() => {
    setContent(globalTypesFileContent)
  }, [globalTypesFileContent])

  return (
    <Modal
      open={open}
      onClose={onClose}
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
        <Button onClick={onClose}>
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
