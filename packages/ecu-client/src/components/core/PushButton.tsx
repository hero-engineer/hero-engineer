import { useCallback } from 'react'
import { useMutation } from 'urql'
import { Button, Tooltip } from 'honorable'
import { GoRepoPush } from 'react-icons/go'

import {
  PushMutation,
  PushMutationDataType,
} from '../../queries'

function PushButton() {
  const [, pushMutation] = useMutation<PushMutationDataType>(PushMutation)

  const handlePushClick = useCallback(() => {
    pushMutation()
  }, [pushMutation])

  return (
    <Tooltip
      label="Push to git repository"
      placement="bottom"
    >
      <Button
        ghost
        borderLeft="1px solid border"
        onClick={handlePushClick}
      >
        <GoRepoPush />
      </Button>
    </Tooltip>
  )
}

export default PushButton
