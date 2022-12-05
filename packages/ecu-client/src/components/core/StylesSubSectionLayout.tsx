import { useCallback } from 'react'
import { Accordion, Button, Div, Tooltip } from 'honorable'
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

import { CssAttributeType, CssValueType, CssValuesType } from '../../types'
import { cssAttributesMap } from '../../constants'

import usePersistedState from '../../hooks/usePersistedState'

import CssValueInput from './CssValueInput'
import StylesSubSectionTitle from './StylesSubSectionTitle'
import StylesSubSectionDisabledOverlay from './StylesSubSectionDisabledOverlay'

type StylesSubSectionLayoutPropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  onChange: (attributes: CssAttributeType[]) => void
  disabled: boolean
}

const attributeNames = [
  'display',
  'flex-direction',
  'flex-wrap',
  'align-items',
  'justify-items',
  'align-content',
  'justify-content',
  'row-gap',
  'column-gap',
]

const displays = [
  {
    name: 'flex',
    label: 'Flex',
    Icon: CgDisplayFlex,
  },
  {
    name: 'block',
    label: 'Block',
    Icon: CgDisplayFullwidth,
  },
  {
    name: 'inline-block',
    label: 'Inline Block',
    Icon: AiOutlineLine,
  },
  {
    name: 'grid',
    label: 'Grid',
    Icon: CgDisplayGrid,
  },
  {
    name: 'none',
    label: 'None',
    Icon: FaRegEyeSlash,
  },
]

const flexAligns = [
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

const flexJustifys = [
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

const gridAligns = [
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
]

const gridJustifys = [
  {
    name: 'flex-start',
    label: 'Start',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'center',
    label: 'Center',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'flex-end',
    label: 'End',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
  },
  {
    name: 'stretch',
    label: 'Stretch',
    getIcon: (isRow: boolean) => isRow ? BiQuestionMark : BiQuestionMark,
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

function StylesSubSectionLayout({ cssValues, breakpointCssValues, onChange, disabled }: StylesSubSectionLayoutPropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-layout-expanded', true)

  const getValue = useCallback((attributeName: string) => breakpointCssValues[attributeName] ?? cssValues[attributeName] ?? cssAttributesMap[attributeName].defaultValue, [breakpointCssValues, cssValues])

  const getTextColor = useCallback((attributeNames: string[]) => (
    attributeNames
    .map(attributeName => (
      typeof breakpointCssValues[attributeName] !== 'undefined'
      && breakpointCssValues[attributeName] !== cssValues[attributeName]
      && breakpointCssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue
        ? 'breakpoint'
        : typeof cssValues[attributeName] !== 'undefined'
        && cssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue
          ? 'primary'
          : 'text-light'
    ))
      .reduce((acc, color) => color === 'breakpoint' ? color : color === 'primary' ? color : acc, 'text-light')
  ), [breakpointCssValues, cssValues])

  const isToggled = useCallback((attributeName: string, values: CssValueType[]) => values.includes(getValue(attributeName)), [getValue])

  const renderDisplayEditor = useCallback(() => (
    <Div xflex="x4s">
      <Div
        xflex="x4"
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['display'])}
      >
        Display
      </Div>
      {displays.map(({ name, label, Icon }) => (
        <Tooltip
          key={name}
          label={label}
          placement="bottom"
        >
          <Button
            ghost
            toggled={isToggled('display', [name])}
            onClick={() => onChange([{ name: 'display', value: name }])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [onChange, isToggled, getTextColor])

  const renderFlexDirectionEditor = useCallback(() => (
    <Div xflex="x4s">
      <Div
        xflex="x4"
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['flex-direction'])}
      >
        Direction
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
  ), [cssValues, onChange, isToggled, getTextColor])

  const renderFlexAlignEditor = useCallback(() => (
    <Div xflex="x1">
      <Div
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['align-items'])}
        pt={0.5}
      >
        Align
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {flexAligns.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

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
  ), [cssValues, breakpointCssValues, onChange, isToggled, getTextColor])

  const renderFlexJustifyEditor = useCallback(() => (
    <Div xflex="x1">
      <Div
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['justify-content'])}
        pt={0.5}
      >
        Justify
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {flexJustifys.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

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
  ), [cssValues, breakpointCssValues, onChange, isToggled, getTextColor])

  const renderFlexGapEditor = useCallback(() => (
    <Div
      xflex="x1"
      fontSize="0.75rem"
      mb={0.25}
    >
      <Div
        xflex="x4"
        minWidth={54}
        color={getTextColor(['column-gap', 'row-gap'])}
        pt={0.25}
      >
        Gap
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
  ), [cssValues, onChange, getTextColor])

  const renderFlexWrapEditor = useCallback(() => (
    <Div
      xflex="x4s"
      minHeight={30} // For flex-wrap button ont to change the layour
    >
      <Div
        xflex="x4"
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['flex-wrap'])}
      >
        Wrap
      </Div>
      <Button
        ghost
        smallText
        toggled={isToggled('flex-wrap', ['wrap', 'wrap-reverse'])}
        onClick={() => onChange([
          { name: 'flex-wrap', value: ['wrap', 'wrap-reverse'].includes((cssValues['flex-wrap'] ?? '').toString()) ? 'nowrap' : 'wrap' },
          { name: 'align-content', value: 'stretch' },
        ])}
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
  ), [cssValues, onChange, isToggled, getTextColor])

  const renderFlexContentEditor = useCallback(() => (
    <Div xflex="x1">
      <Div
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['align-content'])}
        pt={0.5}
      >
        Align
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {flexAligns.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

          return (
            <Tooltip
              key={name}
              label={label}
              placement="bottom"
            >
              <Button
                ghost
                toggled={isToggled('align-content', [name])}
                onClick={() => onChange([{ name: 'align-content', value: name }])}
              >
                <Icon />
              </Button>
            </Tooltip>
          )
        })}
      </Div>
    </Div>
  ), [cssValues, breakpointCssValues, onChange, isToggled, getTextColor])

  const renderGridAlignEditor = useCallback(() => (
    <Div xflex="x1">
      <Div
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['align-items', 'justify-items'])}
        pt={0.5}
      >
        Align
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(5, minmax(0, 1fr))"
      >
        {gridAligns.map(({ name, label, getIcon }) => {
          const Icon = getIcon(true)

          return (
            <Tooltip
              key={name}
              label={`Align items ${label}`}
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
        {gridAligns.map(({ name, label, getIcon }) => {
          const Icon = getIcon(false)

          return (
            <Tooltip
              key={name}
              label={`Justify items ${label}`}
              placement="bottom"
            >
              <Button
                ghost
                toggled={isToggled('justify-items', [name])}
                onClick={() => onChange([{ name: 'justify-items', value: name }])}
              >
                <Icon />
              </Button>
            </Tooltip>
          )
        })}
      </Div>
    </Div>
  ), [onChange, isToggled, getTextColor])

  const renderGridJustifyEditor = useCallback(() => (
    <Div xflex="x1">
      <Div
        minWidth={54}
        fontSize="0.75rem"
        color={getTextColor(['align-content', 'justify-content'])}
        pt={0.5}
      >
        Distribute
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      >
        {gridJustifys.map(({ name, label, getIcon }) => {
          const Icon = getIcon(true)

          return (
            <Tooltip
              key={name}
              label={`Align content ${label}`}
              placement="bottom"
            >
              <Button
                ghost
                toggled={isToggled('align-content', [name])}
                onClick={() => onChange([{ name: 'align-content', value: name }])}
              >
                <Icon />
              </Button>
            </Tooltip>
          )
        })}
        {gridJustifys.map(({ name, label, getIcon }) => {
          const Icon = getIcon(false)

          return (
            <Tooltip
              key={name}
              label={`Justify content ${label}`}
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
  ), [onChange, isToggled, getTextColor])

  const isFlex = isToggled('display', ['flex'])
  const isGrid = isToggled('display', ['grid'])
  const isWrap = isToggled('flex-wrap', ['wrap', 'wrap-reverse'])

  return (
    <Accordion
      ghost
      smallPadding
      smallTitle
      backgroundTitle
      childrenPositionRelative
      title={(
        <StylesSubSectionTitle
          title="Layout"
          expanded={expanded}
          cssValues={cssValues}
          breakpointCssValues={breakpointCssValues}
          attributeNames={attributeNames}
        />
      )}
      expanded={expanded}
      onExpand={setExpanded}
      borderTop="1px solid border"
    >
      <Div
        xflex="y2s"
        gap={0.25}
      >
        {renderDisplayEditor()}
        {isFlex && renderFlexDirectionEditor()}
        {isFlex && renderFlexAlignEditor()}
        {isFlex && renderFlexJustifyEditor()}
        {isFlex && renderFlexGapEditor()}
        {isFlex && renderFlexWrapEditor()}
        {isWrap && renderFlexContentEditor()}
        {isGrid && renderGridAlignEditor()}
        {isGrid && renderGridJustifyEditor()}
      </Div>
      {disabled && <StylesSubSectionDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionLayout
