import { H3, Modal } from 'honorable'

type GlobalTypesModalProps = {
  open: boolean
  onClose: () => void
}

function GlobalTypesModal({ open, onClose }: GlobalTypesModalProps) {
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
