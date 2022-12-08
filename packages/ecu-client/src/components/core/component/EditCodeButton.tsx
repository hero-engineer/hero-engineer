import { useCallback, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { RxCode } from 'react-icons/rx'

import BottomTabsContext from '~contexts/BottomTabsContext'

import { convertFromEcuComponentPath } from '~utils/convertComponentPath'

function EditCodeButton(props: any) {
  const { '*': ecuComponentPath = '' } = useParams()

  const { setTabs } = useContext(BottomTabsContext)

  const handleClick = useCallback(() => {
    if (!ecuComponentPath) return

    const url = `/Users/sven/dev/ecu-app/app/src/${convertFromEcuComponentPath(ecuComponentPath)}`

    setTabs(tabs => tabs.some(x => x.url === url) ? tabs : [...tabs, { url, label: `${url.split('/').pop() ?? '?'} (code)` }])
  }, [ecuComponentPath, setTabs])

  return (
    <Tooltip
      label="Edit code"
      placement="bottom-end"
    >
      <Button
        ghost
        onClick={handleClick}
        {...props}
      >
        <RxCode />
      </Button>
    </Tooltip>
  )
}

export default EditCodeButton
