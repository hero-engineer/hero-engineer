import { Div } from 'honorable'
import { useContext, useEffect, useState } from 'react'

import SnackbarContext from '../../contexts/SnackBarContext'

const duration = 5000
const severityToBorderColor = {
  error: 'red.500',
  warning: 'yellow.500',
  info: 'blue.500',
  success: 'green.500',
}

function SnackBar() {
  const [currentSnackBarItemIndex, setCurrentSnackBarItemIndex] = useState(-1)
  const { snackBarItems, setSnackBarItems } = useContext(SnackbarContext)

  useEffect(() => {
    if (!snackBarItems.length) return

    setCurrentSnackBarItemIndex(snackBarItems.length - 1)
  }, [snackBarItems])

  useEffect(() => {
    if (currentSnackBarItemIndex === -1) return
    if (!snackBarItems[currentSnackBarItemIndex]) return

    setTimeout(() => {
      setSnackBarItems(x => {
        const nextSnackBarItems = [...x]

        nextSnackBarItems[currentSnackBarItemIndex] = {
          ...nextSnackBarItems[currentSnackBarItemIndex],
          cleared: true,
        }

        return nextSnackBarItems
      })
    }, duration)
  }, [currentSnackBarItemIndex, snackBarItems, setSnackBarItems])

  return (
    <Div
      position="fixed"
      bottom={16}
      right={16}
      zIndex={9999999}
    >
      {snackBarItems.filter(x => !x.cleared).map(x => (
        <Div
          backgroundColor="background"
          borderBottom={`1px solid ${severityToBorderColor[x.severity]}`}
          borderRadius="large"
          mt={1}
          p={1}
        >
          {x.content}
        </Div>
      ))}
    </Div>
  )
}

export default SnackBar
