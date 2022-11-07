import { useContext, useEffect, useMemo } from 'react'
import { useQuery } from 'urql'
import { H3, Modal } from 'honorable'

import GlobalTypesContext from '../../contexts/GlobalTypesContext'

import { GlobalTypesQuery, GlobalTypesQueryDataType } from '../../queries'

type GlobalTypesModalProps = {
  open: boolean
  onClose: () => void
}

function GlobalTypesModal({ open, onClose }: GlobalTypesModalProps) {
  const { setGlobalTypes } = useContext(GlobalTypesContext)
  const [globalTypesQueryResult, refetchGlobalTypes] = useQuery<GlobalTypesQueryDataType>({
    query: GlobalTypesQuery,
  })

  const globalTypesFileContent = useMemo(() => globalTypesQueryResult.data?.globalTypes.globalTypesFileContent, [globalTypesQueryResult.data])

  console.log('globalTypesFileContent', globalTypesFileContent)

  useEffect(() => {

  }, [])

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <H3>Global types</H3>
    </Modal>
  )
}

export default GlobalTypesModal
