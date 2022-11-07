import { memo, useCallback, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate } from 'react-router-dom'
import { Button, Div, H2, Input, Modal } from 'honorable'
import { AiOutlinePlus } from 'react-icons/ai'

import { CreateComponentMutation, CreateComponentMutationDataType } from '../../queries'

function CreateComponentButton(props: any) {
  const [name, setName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const [, createComponent] = useMutation<CreateComponentMutationDataType>(CreateComponentMutation)

  const handleCreateComponentClick = useCallback(async () => {
    if (!name) return

    const results = await createComponent({ name })

    if (!results.data) return

    navigate(`/__ecu__/component/${results.data.createComponent.address}`)
  }, [name, createComponent, navigate])

  return (
    <>
      <Button
        ghost
        onClick={() => setIsModalOpen(true)}
        {...props}
      >
        <AiOutlinePlus />
      </Button>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <H2>Create component</H2>
        <Input
          width="100%"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Component name"
          mt={2}
        />
        <Div
          xflex="x6"
          gap={0.5}
          mt={2}
        >
          <Button onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateComponentClick}>
            Create
          </Button>
        </Div>
      </Modal>
    </>
  )
}

export default memo(CreateComponentButton)
