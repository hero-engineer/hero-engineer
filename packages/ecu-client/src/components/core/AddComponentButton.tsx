import { memo, useContext, useState } from 'react'
import { useMutation, useQuery } from 'urql'
import { useParams } from 'react-router-dom'
import { Button, Div, MenuItem, Select } from 'honorable'
import { TbRowInsertBottom } from 'react-icons/tb'

import { AddComponentMutation, ComponentsQuery } from '../../queries'
import HierarchyIdsContext from '../../contexts/HierarchyIdsContext'

import { HierarchyPosition } from '../../types'

function AddComponentButton() {
  const { id } = useParams()
  const { hierarchyIds } = useContext(HierarchyIdsContext)
  const [componentAddress, setComponentId] = useState('')
  const [hierarchyPosition, setHierarchyPosition] = useState<HierarchyPosition>('before')

  const [componentsQueryResult] = useQuery({
    query: ComponentsQuery,
  })
  const [, addComponent] = useMutation(AddComponentMutation)

  if (componentsQueryResult.fetching) {
    return null
  }
  if (componentsQueryResult.error) {
    return null
  }

  function handleAddComponentClick() {
    addComponent({
      sourceComponentAddress: id,
      targetComponentAddress: componentAddress,
      hierarchyIds,
      hierarchyPosition,
    })
  }

  if (!id) {
    return null
  }

  return (
    <Div
      xflex="x4"
      gap={0.5}
    >
      <Select
        value={componentAddress}
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
        ghost
        onClick={handleAddComponentClick}
        disabled={!(componentAddress && hierarchyIds.length)}
      >
        <TbRowInsertBottom />
      </Button>
    </Div>
  )
}

export default memo(AddComponentButton)
