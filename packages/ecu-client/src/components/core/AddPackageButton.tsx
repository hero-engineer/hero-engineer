import { FormEvent, useCallback, useState } from 'react'
import { Button, Div, Form, H3, Input, Modal, Switch } from 'honorable'

function AddPackageButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDevDepenndency, setIsDevDependency] = useState(false)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault()

    console.log('submit', name, isDevDepenndency)

    setIsLoading(true)
  }, [name, isDevDepenndency])

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        loading={isLoading}
      >
        Add package
      </Button>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            <Button
              type="reset"
              onClick={() => setIsModalOpen(false)}
            >
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
    </>
  )
}

export default AddPackageButton
