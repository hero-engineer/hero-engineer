import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Div, Flex, H1, Input } from 'honorable'

import { QueryResultsType, SceneType } from '../../types'

import { CREATE_SCENE_MUTATION, SCENES_QUERY } from '../queries'

function Scenes() {
  const [name, setName] = useState('')
  const { data, loading, error } = useQuery<QueryResultsType<'scenes', SceneType[]>>(SCENES_QUERY)
  const [createScene] = useMutation(CREATE_SCENE_MUTATION, {
    variables: {
      name,
    },
    refetchQueries: [
      SCENES_QUERY,
    ],
  })

  function handleCreateScene() {
    if (name) {
      createScene()
    }
  }

  function renderContent() {
    if (loading || error) return null

    return data.scenes.map(({ id, name }) => (
      <Div key={id}>
        {name}
      </Div>
    ))
  }

  return (
    <Div
      width="66.666%"
      mx="auto"
    >
      <H1>Scenes</H1>
      <Flex mt={1}>
        <Input
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <Button onClick={handleCreateScene}>
          Add scene
        </Button>
      </Flex>
      <Div mt={1}>
        {renderContent()}
      </Div>
    </Div>
  )
}

export default Scenes
