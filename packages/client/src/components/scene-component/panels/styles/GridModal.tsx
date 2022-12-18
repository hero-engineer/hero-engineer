import { H3, Modal } from 'honorable'

import GridEditor from '~components/scene-component/panels/styles/GridEditor'

type GridModalPropsType = {
  open: boolean
  onClose: () => void
}

function GridModal({ open, onClose }: GridModalPropsType) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      minWidth={512}
      backgroundColor="background-light"
    >
      <H3 mb={2}>Edit grid</H3>
      <GridEditor />
    </Modal>
  )
}

export default GridModal
