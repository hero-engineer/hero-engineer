import { useCallback, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Tooltip } from 'honorable'
import { IoCodeSlashOutline } from 'react-icons/io5'

import BottomTabsContext from '~contexts/BottomTabsContext'

import { convertFromHeroEngineerComponentPath } from '~utils/convertComponentPath'

function EditCodeButton(props: any) {
  const { '*': ecuComponentPath = '' } = useParams()

  const { tabs, setTabs, setCurrentTabIndex } = useContext(BottomTabsContext)

  const handleClick = useCallback(() => {
    if (!ecuComponentPath) return

    const url = `/Users/sven/dev/hero-engineer-app/app/src/${convertFromHeroEngineerComponentPath(ecuComponentPath)}`
    const nextTabs = tabs.some(x => x.url === url) ? tabs : [...tabs, { url, label: url.split('/').pop() ?? '?' }]

    setTabs(nextTabs)
    setCurrentTabIndex(nextTabs.findIndex(x => x.url === url) ?? -1)
  }, [ecuComponentPath, tabs, setTabs, setCurrentTabIndex])

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
        <IoCodeSlashOutline />
      </Button>
    </Tooltip>
  )
}

export default EditCodeButton
