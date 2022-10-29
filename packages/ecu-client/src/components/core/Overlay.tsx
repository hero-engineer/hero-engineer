import { memo, useContext, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Div, Input, MenuItem, Select } from 'honorable'

import { AddComponentMutation, ComponentsQuery, CreateComponentMutation, DeleteComponentMutation } from '../../queries'

import EditionContext from '../../contexts/EditionContext'

import HierarchyBar from './HierarchyBar'

function Overlay() {
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
    <>
      <HierarchyBar />
      <Div
        xflex="x4"
        gap={1}
      >
        <Link to="/__ecu__/components">
          Components
        </Link>
        <Input
          value={componentName}
          onChange={e => setComponentName(e.target.value)}
        />
        <Button
          onClick={handleCreateComponentClick}
        >
          Create component
        </Button>
        <AddComponentButton />
        <DeleteComponentButton />
      </Div>
    </>
  )
}

function AddComponentButton() {
  const { id } = useParams()
  const { hierarchyIds } = useContext(EditionContext)
  const [componentId, setComponentId] = useState('')
  const [hierarchyPosition, setHierarchyPosition] = useState('before')
  const [componentsQueryResult] = useQuery({
    query: ComponentsQuery,
  })
  const [, addComponent] = useMutation(AddComponentMutation)

  if (componentsQueryResult.fetching) return null
  if (componentsQueryResult.error) return null

  function handleAddComponentClick() {
    addComponent({
      sourceComponentId: id,
      targetComponentId: componentId,
      hierarchyIds,
      hierarchyPosition,
    })
  }

  if (!id) return null

  return (
    <Div
      xflex="x4"
      gap={1}
    >
      <Select
        value={componentId}
        onChange={event => setComponentId(event.target.value)}
      >
        <MenuItem value="">
          Select a component
        </MenuItem>
        {componentsQueryResult.data.components.map((component: any) => (
          <MenuItem
            key={component.address}
            value={component.address}
          >
            {component.payload.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={hierarchyPosition}
        onChange={event => setHierarchyPosition(event.target.value)}
      >
        <MenuItem value="before">
          Before
        </MenuItem>
        <MenuItem value="after">
          After
        </MenuItem>
        <MenuItem value="within">
          Within
        </MenuItem>
        <MenuItem value="children">
          Children
        </MenuItem>
        <MenuItem value="parent">
          Parent
        </MenuItem>
      </Select>
      <Button
        onClick={handleAddComponentClick}
        disabled={!(componentId && hierarchyIds.length)}
      >
        Add component
      </Button>
    </Div>
  )
}

function DeleteComponentButton() {
  const { id } = useParams()
  const { hierarchyIds } = useContext(EditionContext)
  const [, deleteComponent] = useMutation(DeleteComponentMutation)

  function handleDeleteComponentClick() {
    deleteComponent({
      sourceComponentId: id,
      hierarchyIds,
    })
  }

  if (!id) return null

  return (
    <Button
      onClick={handleDeleteComponentClick}
      disabled={!hierarchyIds.length}
    >
      Delete component
    </Button>
  )
}

export default memo(Overlay)
