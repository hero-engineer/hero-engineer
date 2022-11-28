import { useCallback, useRef } from 'react'
import { Accordion, Button, Div, Tooltip, useOutsideClick } from 'honorable'
import { CgArrowAlignH, CgArrowAlignV, CgDisplayFlex, CgDisplayFullwidth, CgDisplayGrid } from 'react-icons/cg'
import { FaRegEyeSlash } from 'react-icons/fa'
import { AiOutlineLine } from 'react-icons/ai'
import { BiQuestionMark } from 'react-icons/bi'
import {
  MdAlignHorizontalLeft,
  MdAlignVerticalBottom,
  MdAlignVerticalCenter,
  MdAlignVerticalTop,
  MdOutlineAlignHorizontalCenter,
  MdOutlineAlignHorizontalRight,
  MdOutlineSwapHoriz,
} from 'react-icons/md'

import usePersistedState from '../../hooks/usePersistedState'
import { CssAttributeType, CssValueType } from '../../types'
import { cssAttributesMap } from '../../constants'

import CssValueInput from './CssValueInput'

type StylesLayoutSectionPropsType = {
  cssValues: Record<string, CssValueType>
  onChange: (attributes: CssAttributeType[]) => void
}

function addDefaults(attributeNames: string[]) {
  const attributes: CssAttributeType[] = []

  attributeNames.forEach(name => {
    const attribute = cssAttributesMap[name]

    if (attribute) {
      attributes.push({
        name,
        value: attribute.defaultValue,
      })
    }
  })

  return attributes
}

const displays = [
  {
    name: 'flex',
    label: 'Flex',
    Icon: CgDisplayFlex,
    onValueChange: (onChange: (attributes: CssAttributeType[]) => void) => onChange([
      { name: 'display', value: 'flex' },
    ]),
  },
  {
    name: 'block',
    label: 'Block',
    Icon: CgDisplayFullwidth,
    onValueChange: (onChange: (attributes: CssAttributeType[]) => void) => onChange([
      { name: 'display', value: 'block' },
      ...addDefaults(['flex-direction', 'align-items', 'justify-content']),
    ]),
  },
  {
    name: 'inline-block',
    label: 'Inline Block',
    Icon: AiOutlineLine,
    onValueChange: (onChange: (attributes: CssAttributeType[]) => void) => onChange([
      { name: 'display', value: 'inline-block' },
      ...addDefaults(['flex-direction', 'align-items', 'justify-content']),
    ]),
  },
  {
    name: 'grid',
    label: 'Grid',
    Icon: CgDisplayGrid,
    onValueChange: (onChange: (attributes: CssAttributeType[]) => void) => onChange([
      { name: 'display', value: 'grid' },
      ...addDefaults(['flex-direction', 'align-items', 'justify-content']),
    ]),
  },
  {
    name: 'none',
    label: 'None',
    Icon: FaRegEyeSlash,
    onValueChange: (onChange: (attributes: CssAttributeType[]) => void) => onChange([
      { name: 'display', value: 'none' },
      ...addDefaults(['flex-direction', 'align-items', 'justify-content']),
    ]),
  },
]

const aligns = [
  {
    name: 'flex-start',
    label: 'Start',
    getIcon: (isRow: boolean) => isRow ? MdAlignVerticalTop : MdAlignHorizontalLeft,
  },
  {
    name: 'center',
    label: 'Center',
    getIcon: (isRow: boolean) => isRow ? MdAlignVerticalCenter : MdOutlineAlignHorizontalCenter,
  },
  {
    name: 'flex-end',
    label: 'End',
    getIcon: (isRow: boolean) => isRow ? MdAlignVerticalBottom : MdOutlineAlignHorizontalRight,
  },
  {
    name: 'stretch',
    label: 'Stretch',
    getIcon: (isRow: boolean) => isRow ? CgArrowAlignV : CgArrowAlignH,
  },
  {
    name: 'baseline',
    label: 'Baseline',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'space-between',
    label: 'Space Between',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'space-around',
    label: 'Space Around',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'space-evenly',
    label: 'Space Evenly',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
]

const justifys = [
  {
    name: 'flex-start',
    label: 'Start',
    getIcon: (isRow: boolean) => isRow ? MdAlignHorizontalLeft : MdAlignVerticalTop,
  },
  {
    name: 'center',
    label: 'Center',
    getIcon: (isRow: boolean) => isRow ? MdOutlineAlignHorizontalCenter : MdAlignVerticalCenter,
  },
  {
    name: 'flex-end',
    label: 'End',
    getIcon: (isRow: boolean) => isRow ? MdOutlineAlignHorizontalRight : MdAlignVerticalBottom,
  },
  {
    name: 'stretch',
    label: 'Stretch',
    getIcon: (isRow: boolean) => isRow ? CgArrowAlignH : CgArrowAlignV,
  },
  {
    name: 'baseline',
    label: 'Baseline',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'space-between',
    label: 'Space Between',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'space-around',
    label: 'Space Around',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'space-evenly',
    label: 'Space Evenly',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
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
      {displays.map(({ name, label, Icon, onValueChange }) => (
        <Tooltip
          key={name}
          label={label}
          placement="bottom"
        >
          <Button
            ghost
            toggled={isToggled('display', [name])}
            onClick={() => onValueChange(onChange)}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [cssValues, onChange, isToggled])

  const renderFlexDirectionEditor = useCallback(() => (
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
        onClick={() => onChange([{ name: 'flex-direction', value: 'row' }])}
      >
        Horizontal
      </Button>
      <Button
        ghost
        smallText
        toggled={isToggled('flex-direction', ['column', 'column-reverse'])}
        onClick={() => onChange([{ name: 'flex-direction', value: 'column' }])}
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
          onClick={() => onChange([{ name: 'flex-direction', value: (cssValues['flex-direction'] ?? '').toString().endsWith('-reverse') ? cssValues['flex-direction'].toString().slice(0, -'-reverse'.length) : `${cssValues['flex-direction'] || cssAttributesMap['flex-direction'].defaultValue}-reverse` }])}
        >
          <MdOutlineSwapHoriz />
        </Button>
      </Tooltip>
    </Div>
  ), [cssValues, onChange, isToggled])

  const renderFlexAlignEditor = useCallback(() => (
    <Div xflex="x1">
      <Div
        minWidth={54}
        fontSize="0.75rem"
        color={cssValues['align-items'] && cssValues['align-items'] !== cssAttributesMap['align-items'].defaultValue ? 'primary' : 'text-light'}
        pt={0.5}
      >
        Align:
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {aligns.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

          return (
            <Tooltip
              key={name}
              label={label}
              placement="bottom"
            >
              <Button
                ghost
                toggled={isToggled('align-items', [name])}
                onClick={() => onChange([{ name: 'align-items', value: name }])}
              >
                <Icon />
              </Button>
            </Tooltip>
          )
        })}
      </Div>
    </Div>
  ), [cssValues, onChange, isToggled])

  const renderFlexJustifyEditor = useCallback(() => (
    <Div xflex="x1">
      <Div
        minWidth={54}
        fontSize="0.75rem"
        color={cssValues['justify-content'] && cssValues['justify-content'] !== cssAttributesMap['justify-content'].defaultValue ? 'primary' : 'text-light'}
        pt={0.5}
      >
        Justify:
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {justifys.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

          return (
            <Tooltip
              key={name}
              label={label}
              placement="bottom"
            >
              <Button
                ghost
                toggled={isToggled('justify-content', [name])}
                onClick={() => onChange([{ name: 'justify-content', value: name }])}
              >
                <Icon />
              </Button>
            </Tooltip>
          )
        })}
      </Div>
    </Div>
  ), [cssValues, onChange, isToggled])

  const renderFlexGapEditor = useCallback(() => (
    <Div
      xflex="x1"
      fontSize="0.75rem"
      mb={0.25}
    >
      <Div
        xflex="x4"
        minWidth={54}
        color={(cssValues['column-gap'] && cssValues['column-gap'] !== cssAttributesMap['column-gap'].defaultValue) || (cssValues['row-gap'] && cssValues['row-gap'] !== cssAttributesMap['row-gap'].defaultValue) ? 'primary' : 'text-light'}
        pt={0.25}
      >
        Gap:
      </Div>
      <Div
        xflex="x4"
        gap={0.5}
      >
        <Div
          xflex="y1"
          gap={0.25}
        >
          <CssValueInput
            value={(cssValues['row-gap'] ?? cssAttributesMap['row-gap'].defaultValue).toString()}
            onChange={value => onChange([{ name: 'row-gap', value }])}
          />
          <Div color="text-light">
            Rows
          </Div>
        </Div>
        <Div
          xflex="y1"
          gap={0.25}
        >
          <CssValueInput
            value={(cssValues['column-gap'] ?? cssAttributesMap['column-gap'].defaultValue).toString()}
            onChange={value => onChange([{ name: 'column-gap', value }])}
          />
          <Div color="text-light">
            Columns
          </Div>
        </Div>
      </Div>
    </Div>
  ), [cssValues, onChange])

  const renderFlexWrapEditor = useCallback(() => (
    <Div
      xflex="x4s"
      minHeight={30} // For flex-wrap button ont to change the layour
    >
      <Div
        xflex="x4"
        minWidth={54}
        fontSize="0.75rem"
        color={cssValues['flex-wrap'] && cssValues['flex-wrap'] !== cssAttributesMap['flex-wrap'].defaultValue ? 'primary' : 'text-light'}
      >
        Wrap:
      </Div>
      <Button
        ghost
        smallText
        toggled={isToggled('flex-wrap', ['wrap', 'wrap-reverse'])}
        onClick={() => onChange([{ name: 'flex-wrap', value: ['wrap', 'wrap-reverse'].includes((cssValues['flex-wrap'] ?? '').toString()) ? 'nowrap' : 'wrap' }])}
      >
        Wrap
      </Button>
      {['wrap', 'wrap-reverse'].includes((cssValues['flex-wrap'] ?? '').toString()) && (
        <Tooltip
          label="Reverse"
          placement="bottom"
        >
          <Button
            ghost
            toggled={(cssValues['flex-wrap'] ?? '').toString() === 'wrap-reverse'}
            onClick={() => onChange([{ name: 'flex-wrap', value: (cssValues['flex-wrap'] ?? '').toString() === 'wrap-reverse' ? 'wrap' : 'wrap-reverse' }])}
          >
            <MdOutlineSwapHoriz />
          </Button>
        </Tooltip>
      )}
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
        {cssValues.display === 'flex' && renderFlexDirectionEditor()}
        {cssValues.display === 'flex' && renderFlexAlignEditor()}
        {cssValues.display === 'flex' && renderFlexJustifyEditor()}
        {cssValues.display === 'flex' && renderFlexGapEditor()}
        {cssValues.display === 'flex' && renderFlexWrapEditor()}
      </Div>
    </Accordion>
  )
}

export default StylesLayoutSection
