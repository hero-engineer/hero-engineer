import { useCallback, useContext, useState } from 'react'
import { useMutation } from 'urql'
import { useNavigate } from 'react-router-dom'
import { Button, Div, H2, Input, Modal, Tooltip } from 'honorable'
import { AiOutlinePlus } from 'react-icons/ai'

import { SaveFileMutation, SaveFileMutationDataType } from '~queries'

import EnvContext from '~contexts/EnvContext'

import createComponentCode from '~data/componentTemplate'

const componentNameRegex = /^[A-Z][a-zA-Z0-9]*$/

// A button that pops a modal for creating a new component
function CreateComponentButton(props: any) {
  const env = useContext(EnvContext)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [relativePath, setRelativePath] = useState('components/')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [, saveFile] = useMutation<SaveFileMutationDataType>(SaveFileMutation)

  const handleCreateComponentClick = useCallback(async () => {
    if (!name) return

    if (!componentNameRegex.test(name)) {
      window.alert('Invalid component name. Components names must start with a capital letter and contain only letters and numbers.')

      return
    }

    setIsLoading(true)

    const code = createComponentCode(name)
    const fullRelativePath = `${relativePath}${relativePath.endsWith('/') || name.startsWith('/') ? '' : '/'}${name}`

    await saveFile({
      filePath: `${env.VITE_CWD}/src/${fullRelativePath}.tsx`,
      code,
      commitMessage: `Create component ${name}`,
    })

    navigate(`/_hero_/~/${fullRelativePath}`)
    setIsModalOpen(false)
    setName('')
    setRelativePath('components/')
    setIsLoading(false)
  }, [env.VITE_CWD, name, relativePath, saveFile, navigate])

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
        <Div
          fontWeight="bold"
          mt={2}
        >
          Name
        </Div>
        <Input
          width="100%"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ProductCard"
          mt={0.5}
        />
        <Div
          fontWeight="bold"
          mt={2}
        >
          Path
        </Div>
        <Input
          width="100%"
          value={relativePath}
          onChange={e => setRelativePath(e.target.value)}
          startIcon="src/"
          StartIconProps={{
            paddingRight: 0,
          }}
          mt={0.5}
        />
        <Div
          xflex="x6"
          gap={0.5}
          mt={2}
        >
          <Button onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            loading={isLoading}
            onClick={handleCreateComponentClick}
          >
            Create
          </Button>
        </Div>
      </Modal>
    </>
  )
}

export default CreateComponentButton
