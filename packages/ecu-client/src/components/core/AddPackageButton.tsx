import { FormEvent, useCallback, useState } from 'react'
import { Button, Div, Form, H3, Input, Label, Modal, Switch } from 'honorable'

import { refetchKeys } from '../../constants'

import { InstallOrUpdatePackageMutation, InstallOrUpdatePackageMutationDataType } from '../../queries'

import useMutation from '../../hooks/useMutation'
import useRefetch from '../../hooks/useRefetch'

function AddPackageButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDevDepenndency, setIsDevDependency] = useState(false)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [, updateOrInstallPackage] = useMutation<InstallOrUpdatePackageMutationDataType>(InstallOrUpdatePackageMutation)

  const refetch = useRefetch()

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()

    if (!name) return

    setIsModalOpen(false)
    setIsLoading(true)

    await updateOrInstallPackage({
      name,
      version: '',
      type: isDevDepenndency ? 'devDependencies' : 'dependencies',
      shouldDelete: false,
    })

    setIsLoading(false)
    setName('')

    refetch(refetchKeys.packages)
    refetch(refetchKeys.packagesUpdates)
  }, [name, isDevDepenndency, updateOrInstallPackage, refetch])

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
          <Label mt={2}>
            Use @ to install a specific version. E.g. lodash@4.0.0
          </Label>
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
            mt={0.25}
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
              disabled={!name}
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
