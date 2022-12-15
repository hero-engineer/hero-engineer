import { H3, Modal } from 'honorable'

import { CssAttributeType, NormalizedCssAttributesType } from '~types'

import GridEditor from '~core/full-ast/panels/styles/GridEditor'

type GridModalPropsType = {
  open: boolean
  attributes: NormalizedCssAttributesType
  breakpointAttributes: NormalizedCssAttributesType
  onChange: (attributes: CssAttributeType[]) => void
  onClose: () => void
}

function GridModal({ open, attributes, breakpointAttributes, onChange, onClose }: GridModalPropsType) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      minWidth={512}
      backgroundColor="background-light"
    >
      <H3 mb={2}>Edit grid</H3>
      <GridEditor
        attributes={attributes}
        breakpointAttributes={breakpointAttributes}
        onChange={onChange}
      />
    </Modal>
  )
}

export default GridModal
