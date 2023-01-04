import { useCallback, useState } from 'react'
import { useMutation } from 'urql'
import { Button, Tooltip } from 'honorable'
import { GoRepoPush } from 'react-icons/go'

import { PushMutation, PushMutationDataType } from '~queries'

// The git push button
function PushButton() {
  const [loading, setLoading] = useState(false)

  const [, pushMutation] = useMutation<PushMutationDataType>(PushMutation)

  const handlePushClick = useCallback(async () => {
    setLoading(true)
    await pushMutation()
    setLoading(false)
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
        loading={loading}
        spinnerColor="text"
      >
        <GoRepoPush />
      </Button>
    </Tooltip>
  )
}

export default PushButton
