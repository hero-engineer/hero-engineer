import { memo, useCallback, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate } from 'react-router-dom'
import { Button, Div, H2, Input, Modal, Tooltip } from 'honorable'
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

    setIsModalOpen(false)
    setName('')

    if (!results.data) return

    const { file, component } = results.data.createComponent

    navigate(`/_ecu_/component/${file.address}/${component.address}`)
  }, [name, createComponent, navigate])

  return (
    <>
      <Tooltip
        label="Create component"
        placement="bottom-start"
      >
        <Button
          ghost
          onClick={() => setIsModalOpen(true)}
          {...props}
        >
          <AiOutlinePlus />
        </Button>
      </Tooltip>
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
