import { Div } from 'honorable'
import { useContext, useEffect, useState } from 'react'

import { zIndexes } from '@constants'

import SnackbarContext from '@contexts/SnackBarContext'

const duration = 5000
const severityToBorderColor = {
  error: 'danger',
  warning: 'warning',
  info: 'info',
  success: 'success',
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
      zIndex={zIndexes.snackBar}
    >
      {snackBarItems.filter(x => !x.cleared).map(x => (
        <Div
          key={x.id}
          elevation={1}
          backgroundColor="background"
          borderBottom={`1px solid ${severityToBorderColor[x.severity]}`}
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
