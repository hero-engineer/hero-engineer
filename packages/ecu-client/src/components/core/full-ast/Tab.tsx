import { MouseEvent } from 'react'
import { Div } from 'honorable'
import { MdClose } from 'react-icons/md'

const iconStyle = {
  fontSize: '0.75rem',
}

type TabPropsType = {
  label: string
  active: boolean
  onClick: () => void
  onClose: (event: MouseEvent) => void
}

function Tab({ label, active, onClick, onClose }: TabPropsType) {
  return (
    <Div
      xflex="x4s"
      backgroundColor={active ? 'background' : null}
      borderBottom={active ? null : '1px solid border'}
      borderRight="1px solid border"
      _hover={{ backgroundColor: active ? 'background' : 'background-light-dark' }}
      onClick={onClick}
      cursor="pointer"
      pl={1}
      pr={0.25}
    >
      <Div xflex="x4">
        {label}
      </Div>
      <Div
        xflex="x5"
        fontSize="0.75rem"
        onClick={onClose}
        pl={0.5}
        pr={0.25}
      >
        <MdClose style={iconStyle} />
      </Div>
    </Div>
  )
}

export default Tab
