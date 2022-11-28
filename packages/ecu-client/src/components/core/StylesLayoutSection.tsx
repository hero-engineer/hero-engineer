import { useCallback } from 'react'
import { Accordion, Button, Div } from 'honorable'
import { CgDisplayFlex, CgDisplayFullwidth, CgDisplayGrid } from 'react-icons/cg'
import { FaRegEyeSlash } from 'react-icons/fa'

import usePersistedState from '../../hooks/usePersistedState'
import { CssValueType } from '../../types'
import { cssAttributesMap } from '../../constants'

type StylesLayoutSectionPropsType = {
  workingCssValues: Record<string, CssValueType>
  onChange: (attributeName: string, value: CssValueType) => void
}

const displays = [
  {
    name: 'flex',
    Icon: CgDisplayFlex,
  },
  {
    name: 'block',
    Icon: CgDisplayFullwidth,
  },
  {
    name: 'grid',
    Icon: CgDisplayGrid,
  },
  {
    name: 'none',
    Icon: FaRegEyeSlash,
  },
]

function StylesLayoutSection({ workingCssValues, onChange }: StylesLayoutSectionPropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-layout-section-expanded', true)

  console.log('workingCssValues.display', workingCssValues.display)

  const renderDisplayEditor = useCallback(() => (
    <Div xflex="x4">
      <Div
        minWidth={46}
        fontSize="0.75rem"
        color={workingCssValues.display && workingCssValues.display !== cssAttributesMap.display.defaultValue ? 'primary' : 'text-light'}
      >
        Display:
      </Div>
      {displays.map(({ name, Icon }) => (
        <Button
          ghost
          toggled={workingCssValues.display ? workingCssValues.display === name : cssAttributesMap.display.defaultValue === name}
          onClick={() => onChange('display', name)}
          key={name}
        >
          <Icon />
        </Button>
      ))}
    </Div>
  ), [workingCssValues, onChange])

  return (
    <Accordion
      ghost
      smallPadding
      smallTitle
      backgroundTitle
      title="Layout"
      expanded={expanded}
      onExpand={setExpanded}
    >
      {renderDisplayEditor()}
    </Accordion>
  )
}

export default StylesLayoutSection
