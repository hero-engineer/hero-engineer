import { MouseEvent, ReactNode } from 'react'
import { Div } from 'honorable'
import { MdClose } from 'react-icons/md'

const iconStyle = {
  fontSize: '0.75rem',
}

type TabPropsType = {
  label: string
  active: boolean
  icon?: ReactNode
  onClick: (event: MouseEvent) => void
  onClose: (event: MouseEvent) => void
}

function Tab({ label, active, icon, onClick, onClose }: TabPropsType) {
  return (
    <Div
      xflex="x4s"
      width={128}
      maxWidth={128}
      backgroundColor={active ? 'background' : null}
      borderBottom={`1px solid ${active ? 'transparent' : 'border'}`}
      borderRight="1px solid border"
      _hover={{
        backgroundColor: active ? 'background' : 'background-light-dark',
        '> #Tab-close': {
          display: 'flex',
        },
      }}
      onClick={onClick}
      cursor="pointer"
      pl={1}
      pr={0.25}
    >
      {!!icon && (
        <Div
          xflex="x5"
          flexShrink={0}
          color="text-light"
          ml={-0.5}
          pr={0.5}
        >
          {icon}
        </Div>
      )}
      <Div
        xflex="x4"
        flexGrow
        flexShrink={1}
        minWidth={0} // For ellipsis to work
      >
        <Div ellipsis>
          {label}
        </Div>
      </Div>
      <Div
        id="Tab-close"
        xflex="x5"
        flexShrink={0}
        display="none"
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
