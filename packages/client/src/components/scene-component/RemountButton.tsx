import { memo, useContext } from 'react'
import { Button, Tooltip } from 'honorable'
import { AiOutlineReload } from 'react-icons/ai'

import ComponentRemountContext from '~contexts/ComponentRemountContext'

function RemountButton(props: any) {
  const { setKey } = useContext(ComponentRemountContext)

  return (
    <Tooltip
      label="Reload component"
      placement="bottom-end"
    >
      <Button
        ghost
        onClick={() => setKey(x => x + 1)}
        {...props}
      >
        <AiOutlineReload />
      </Button>
    </Tooltip>
  )
}

export default memo(RemountButton)
