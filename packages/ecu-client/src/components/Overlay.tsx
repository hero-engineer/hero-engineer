import { memo, useContext, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { Link, useNavigate } from 'react-router-dom'

import { AddComponentMutation, ComponentsQuery, CreateComponentMutation } from '../queries'

import EditionContext from '../contexts/EditionContext'

function Overlay() {
  const [componentName, setComponentName] = useState('')
  const [, createComponent] = useMutation(CreateComponentMutation)
  const navigate = useNavigate()

  function handleCreateComponentClick() {
    createComponent({ name: componentName })
    .then(result => {
      console.log('result', result)
      navigate(`/__ecu__/component/${result.data.createComponent.id}`)
    })
  }

  return (
    <div>
      <input
        value={componentName}
        onChange={e => setComponentName(e.target.value)}
      />
      <button
        onClick={handleCreateComponentClick}
        type="button"
      >
        Create component
      </button>
      <Link to="/__ecu__/components">
        Components
      </Link>
      <AddComponentButton />
    </div>
  )
}

function AddComponentButton() {
  const { hierarchyIds } = useContext(EditionContext)
  const [componentId, setComponentId] = useState('')
  const [hierarchyPosition, setHierarchyPosition] = useState('after')
  const [componentsQueryResult] = useQuery({
    query: ComponentsQuery,
  })
  const [, addComponent] = useMutation(AddComponentMutation)

  if (componentsQueryResult.fetching) return null
  if (componentsQueryResult.error) return null

  function handleAddComponentClick() {
    addComponent({ componentId, hierarchyIds, hierarchyPosition })
  }

  return (
    <div>
      <select
        value={componentId}
        onChange={event => setComponentId(event.target.value)}
      >
        <option value="">Select a component</option>
        {componentsQueryResult.data.components.map((component: any) => (
          <option
            key={component.id}
            value={component.id}
          >
            {component.name}
          </option>
        ))}
      </select>
      <select
        value={hierarchyPosition}
        onChange={event => setHierarchyPosition(event.target.value)}
      >
        <option value="before">Before</option>
        <option value="after">After</option>
        <option value="within">Within</option>
      </select>
      <button
        onClick={handleAddComponentClick}
        type="button"
        disabled={!(componentId && hierarchyIds.length)}
      >
        Add component
      </button>
    </div>
  )
}

export default memo(Overlay)
