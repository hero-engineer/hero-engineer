import { memo, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate } from 'react-router-dom'
import { Button, Div, Input } from 'honorable'

import { CreateComponentMutation } from '../../queries'

function CreateComponentButton() {
  const [componentName, setComponentName] = useState('')
  const [, createComponent] = useMutation(CreateComponentMutation)
  const navigate = useNavigate()

  function handleCreateComponentClick() {
    createComponent({ name: componentName })
      .then(result => {
        navigate(`/__ecu__/component/${result.data.createComponent.address}`)
      })
  }

  return (
    <Div
      xflex="x4"
      gap={1}
    >
      <Input
        value={componentName}
        onChange={e => setComponentName(e.target.value)}
      />
      <Button
        onClick={handleCreateComponentClick}
      >
        Create component
      </Button>
    </Div>
  )
}

export default memo(CreateComponentButton)
