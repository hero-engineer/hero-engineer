import { useCallback } from 'react'
import { Accordion, Button, Div, Tooltip } from 'honorable'
import { CgDisplayFlex, CgDisplayFullwidth, CgDisplayGrid } from 'react-icons/cg'
import { FaRegEyeSlash } from 'react-icons/fa'
import { AiOutlineLine } from 'react-icons/ai'
import { MdOutlineSwapHoriz } from 'react-icons/md'

import usePersistedState from '../../hooks/usePersistedState'
import { CssValueType } from '../../types'
import { cssAttributesMap } from '../../constants'

type StylesLayoutSectionPropsType = {
  cssValues: Record<string, CssValueType>
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
    name: 'inline-block',
    Icon: AiOutlineLine,
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

function StylesLayoutSection({ cssValues, onChange }: StylesLayoutSectionPropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-layout-section-expanded', true)

  const isToggled = useCallback((attributeName: string, values: CssValueType[]) => values.includes(cssValues[attributeName] ?? cssAttributesMap[attributeName].defaultValue), [cssValues])

  const renderDisplayEditor = useCallback(() => (
    <Div xflex="x4s">
      <Div
        xflex="x4"
        minWidth={54}
        fontSize="0.75rem"
        color={cssValues.display && cssValues.display !== cssAttributesMap.display.defaultValue ? 'primary' : 'text-light'}
      >
        Display:
      </Div>
      {displays.map(({ name, Icon }) => (
        <Tooltip
          key={name}
          label={name}
          placement="bottom"
        >
          <Button
            ghost
            toggled={isToggled('display', [name])}
            onClick={() => onChange('display', name)}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [cssValues, onChange, isToggled])

  const renderFlexEditor = useCallback(() => (
    <Div xflex="x4s">
      <Div
        xflex="x4"
        minWidth={54}
        fontSize="0.75rem"
        color={cssValues['flex-direction'] && cssValues['flex-direction'] !== cssAttributesMap['flex-direction'].defaultValue ? 'primary' : 'text-light'}
      >
        Direction:
      </Div>
      <Button
        ghost
        smallText
        toggled={isToggled('flex-direction', ['row', 'row-reverse'])}
        onClick={() => onChange('flex-direction', 'row')}
      >
        Horizontal
      </Button>
      <Button
        ghost
        smallText
        toggled={isToggled('flex-direction', ['column', 'column-reverse'])}
        onClick={() => onChange('flex-direction', 'column')}
      >
        Vertical
      </Button>
      <Tooltip
        label="Reverse"
        placement="bottom"
      >
        <Button
          ghost
          toggled={(cssValues['flex-direction'] ?? '').toString().endsWith('-reverse')}
          onClick={() => onChange('flex-direction', (cssValues['flex-direction'] ?? '').toString().endsWith('-reverse') ? cssValues['flex-direction'].toString().slice(0, -'-reverse'.length) : `${cssValues['flex-direction'] || cssAttributesMap['flex-direction'].defaultValue}-reverse`)}
        >
          <MdOutlineSwapHoriz />
        </Button>
      </Tooltip>
    </Div>
  ), [cssValues, onChange, isToggled])

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
      <Div
        xflex="y2s"
        gap={0.25}
      >
        {renderDisplayEditor()}
        {cssValues.display === 'flex' && renderFlexEditor()}
      </Div>
    </Accordion>
  )
}

export default StylesLayoutSection
