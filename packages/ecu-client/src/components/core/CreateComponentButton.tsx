import { memo, useCallback, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate } from 'react-router-dom'
import { Button, Div, H2, Input, Modal } from 'honorable'
import { AiOutlinePlus } from 'react-icons/ai'

import { CreateComponentMutation } from '../../queries'

function CreateComponentButton() {
  const [name, setName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [, createComponent] = useMutation(CreateComponentMutation)
  const navigate = useNavigate()

  const handleCreateComponentClick = useCallback(async () => {
    if (!name) return

    const results = await createComponent({ name })

    navigate(`/__ecu__/component/${results.data.createComponent.address}`)
  }, [name, createComponent, navigate])

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
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
