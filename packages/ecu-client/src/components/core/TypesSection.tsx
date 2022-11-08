import { A } from 'honorable'
import { useState } from 'react'

import GlobalTypesModal from './GlobalTypesModal'

function TypesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <A onClick={() => setIsModalOpen(true)}>
        Global types
      </A>
      <GlobalTypesModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default TypesSection
