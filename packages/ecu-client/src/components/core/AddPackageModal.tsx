import { FormEvent, useCallback, useState } from 'react'
import { Button, Div, Form, H3, Input, Modal, Switch } from 'honorable'

type AddPackageModalPropsType = {
  open: boolean
  onClose: () => void
}

function AddPackageModal({ open, onClose }: AddPackageModalPropsType) {
  const [isDevDepenndency, setIsDevDependency] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()

  }, [])

  return (
    <Modal
      open={open}
      onClose={onClose}
      minWidth={512}
    >
      <Form onSubmit={handleSubmit}>
        <H3>
          Add package
        </H3>
        <Switch
          checked={isDevDepenndency}
          onChange={event => setIsDevDependency(event.target.checked)}
          mt={2}
        >
          devDependecies
        </Switch>
        <Input
          autoFocus
          width="100%"
          startIcon={(
            <Div color="text-light">
              {`npm install --save${isDevDepenndency ? '-dev' : ''}`}
            </Div>
          )}
          value={name}
          onChange={event => setName(event.target.value)}
          mt={2}
        />
        <Div
          xflex="x6"
          gap={0.5}
          mt={2}
        >
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
          >
            Run
          </Button>
        </Div>
      </Form>
    </Modal>
  )
}

export default AddPackageModal
