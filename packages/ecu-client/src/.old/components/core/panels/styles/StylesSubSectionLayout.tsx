import { useCallback, useMemo, useState } from 'react'
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

import { CssAttributeType, CssValuesType } from '~types'

import { cssAttributesMap } from '~constants'

import usePersistedState from '~hooks/usePersistedState'
import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

import CssValueInput from '../../css/CssValueInput'

import GridModal from './GridModal'
import StylesTitle from './StylesTitle'
import StylesAttributeTitle from './StylesAttributeTitle'
import StylesDisabledOverlay from './StylesDisabledOverlay'

type StylesSubSectionLayoutPropsType = {
  cssValues: CssValuesType
  breakpointCssValues: CssValuesType
  currentBreakpointCssValues: CssValuesType
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
  'grid-auto-flow',
]

const displays = [
  {
    name: 'block',
    label: 'Block',
    Icon: CgDisplayFullwidth,
  },
  {
    name: 'flex',
    label: 'Flex',
    Icon: CgDisplayFlex,
  },
  {
    name: 'grid',
    label: 'Grid',
    Icon: CgDisplayGrid,
  },
  {
    name: 'inline-block',
    label: 'Inline Block',
    Icon: AiOutlineLine,
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

function StylesSubSectionLayout({ cssValues, breakpointCssValues, currentBreakpointCssValues, onChange, disabled }: StylesSubSectionLayoutPropsType) {
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-layout-expanded', true)
  const [isGridModalOpen, setIsGridModalOpen] = useState(false)

  const { isToggled } = useStylesSubSectionHelpers(cssValues, breakpointCssValues)

  const attributeTitleProps = useMemo(() => ({
    cssValues,
    breakpointCssValues,
    currentBreakpointCssValues,
    onChange,
  }), [cssValues, breakpointCssValues, currentBreakpointCssValues, onChange])

  const renderDisplayEditor = useCallback(() => (
    <Div xflex="x4s">
      <StylesAttributeTitle
        attributeNames={['display']}
        {...attributeTitleProps}
      >
        Display
      </StylesAttributeTitle>
      {displays.map(({ name, label, Icon }) => (
        <Tooltip
          key={name}
          label={label}
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
  ), [attributeTitleProps, isToggled, onChange])

  const renderFlexDirectionEditor = useCallback(() => {
    const isReverse = (breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? '').toString().endsWith('-reverse')

    return (
      <Div
        xflex="x4s"
        fontSize="0.75rem"
      >
        <StylesAttributeTitle
          attributeNames={['flex-direction']}
          {...attributeTitleProps}
        >
          Direction
        </StylesAttributeTitle>
        <Button
          ghost
          toggled={isToggled('flex-direction', ['row', 'row-reverse'])}
          onClick={() => onChange([{ name: 'flex-direction', value: `row${isReverse ? '-reverse' : ''}` }])}
        >
          Horizontal
        </Button>
        <Button
          ghost
          toggled={isToggled('flex-direction', ['column', 'column-reverse'])}
          onClick={() => onChange([{ name: 'flex-direction', value: `column${isReverse ? '-reverse' : ''}` }])}
        >
          Vertical
        </Button>
        <Tooltip
          label="Reverse"
        >
          <Button
            ghost
            toggled={isReverse}
            onClick={() => onChange([{ name: 'flex-direction', value: isReverse ? (breakpointCssValues['flex-direction'] ?? cssValues['flex-direction']).toString().slice(0, -'-reverse'.length) : `${breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue}-reverse` }])}
          >
            <MdOutlineSwapHoriz />
          </Button>
        </Tooltip>
      </Div>
    )
  }, [cssValues, breakpointCssValues, attributeTitleProps, isToggled, onChange])

  const renderFlexAlignEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['align-items']}
        pt={0.25 / 2}
        {...attributeTitleProps}
      >
        Align
      </StylesAttributeTitle>
      <Div
        display="grid"
        gridTemplateColumns="repeat(8, minmax(0, 1fr))"
      >
        {flexAligns.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

          return (
            <Tooltip
              key={name}
              label={label}
            >
              <Button
                ghost
                tiny
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
  ), [cssValues, breakpointCssValues, attributeTitleProps, isToggled, onChange])

  const renderFlexJustifyEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['justify-content']}
        pt={0.25 / 2}
        {...attributeTitleProps}
      >
        Justify
      </StylesAttributeTitle>
      <Div
        display="grid"
        gridTemplateColumns="repeat(8, minmax(0, 1fr))"
      >
        {flexJustifys.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

          return (
            <Tooltip
              key={name}
              label={label}
            >
              <Button
                ghost
                tiny
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
  ), [cssValues, breakpointCssValues, attributeTitleProps, isToggled, onChange])

  const renderGapEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['column-gap', 'row-gap']}
        pt={0.25 / 2}
        {...attributeTitleProps}
      >
        Gap
      </StylesAttributeTitle>
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
  ), [cssValues, attributeTitleProps, onChange])

  const renderFlexWrapEditor = useCallback(() => {
    const isReverse = (breakpointCssValues['flex-wrap'] ?? cssValues['flex-wrap'] ?? '').toString() === 'wrap-reverse'

    return (
      <Div
        xflex="x4s"
        minHeight={30} // For flex-wrap button not to change the layout
        fontSize="0.75rem"
      >
        <StylesAttributeTitle
          attributeNames={['flex-wrap']}
          {...attributeTitleProps}
        >
          Wrap
        </StylesAttributeTitle>
        <Button
          ghost
          toggled={isToggled('flex-wrap', ['wrap', 'wrap-reverse'])}
          onClick={() => onChange([
            { name: 'flex-wrap', value: ['wrap', 'wrap-reverse'].includes((cssValues['flex-wrap'] ?? '').toString()) ? 'nowrap' : `wrap${isReverse ? '-reverse' : ''}` },
            { name: 'align-content', value: 'stretch' },
          ])}
        >
          Wrap
        </Button>
        {['wrap', 'wrap-reverse'].includes((cssValues['flex-wrap'] ?? '').toString()) && (
          <Tooltip
            label="Reverse"
          >
            <Button
              ghost
              toggled={isReverse}
              onClick={() => onChange([{ name: 'flex-wrap', value: isReverse ? 'wrap' : 'wrap-reverse' }])}
            >
              <MdOutlineSwapHoriz />
            </Button>
          </Tooltip>
        )}
      </Div>
    )
  }, [cssValues, breakpointCssValues, attributeTitleProps, isToggled, onChange])

  const renderFlexContentEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['align-content']}
        pt={0.25 / 2}
        {...attributeTitleProps}
      >
        Align
      </StylesAttributeTitle>
      <Div
        display="grid"
        gridTemplateColumns="repeat(8, minmax(0, 1fr))"
      >
        {flexAligns.map(({ name, label, getIcon }) => {
          const Icon = getIcon(['row', 'row-reverse'].includes((breakpointCssValues['flex-direction'] ?? cssValues['flex-direction'] ?? cssAttributesMap['flex-direction'].defaultValue).toString()))

          return (
            <Tooltip
              key={name}
              label={label}
            >
              <Button
                ghost
                tiny
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
  ), [cssValues, breakpointCssValues, attributeTitleProps, isToggled, onChange])

  const renderGridEditor = useCallback(() => (
    <>
      <Div
        xflex="x4"
        fontSize="0.75rem"
      >
        <Div minWidth={54} />
        <Button
          ghost
          ghostBorder
          onClick={() => setIsGridModalOpen(true)}
        >
          Edit grid
        </Button>
      </Div>
      <GridModal
        open={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        cssValues={cssValues}
        breakpointCssValues={breakpointCssValues}
        onChange={onChange}
      />
    </>
  ), [isGridModalOpen, cssValues, breakpointCssValues, onChange])

  const renderGridAlignEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['align-items', 'justify-items']}
        pt={0.5}
        {...attributeTitleProps}
      >
        Align
      </StylesAttributeTitle>
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
  ), [attributeTitleProps, isToggled, onChange])

  const renderGridJustifyEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['align-content', 'justify-content']}
        pt={0.5}
        {...attributeTitleProps}
      >
        Distribute
      </StylesAttributeTitle>
      <Div
        display="grid"
        gridTemplateColumns="repeat(8, minmax(0, 1fr))"
      >
        {gridJustifys.map(({ name, label, getIcon }) => {
          const Icon = getIcon(true)

          return (
            <Tooltip
              key={name}
              label={`Align content ${label}`}
            >
              <Button
                ghost
                tiny
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
            >
              <Button
                ghost
                tiny
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
  ), [attributeTitleProps, isToggled, onChange])

  const isFlex = isToggled('display', ['flex'])
  const isGrid = isToggled('display', ['grid'])
  const isWrap = isToggled('flex-wrap', ['wrap', 'wrap-reverse'])

  return (
    <Accordion
      ghost
      backgroundTitle
      smallTitle
      smallTitlePadding
      smallChildrenPadding
      childrenPositionRelative
      title={(
        <StylesTitle
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
        fontSize="0.75rem"
        gap={0.5}
      >
        {renderDisplayEditor()}
        {isFlex && renderFlexDirectionEditor()}
        {isFlex && renderFlexAlignEditor()}
        {isFlex && renderFlexJustifyEditor()}
        {isFlex && renderGapEditor()}
        {isFlex && renderFlexWrapEditor()}
        {isWrap && renderFlexContentEditor()}
        {isGrid && renderGridEditor()}
        {isGrid && renderGridAlignEditor()}
        {isGrid && renderGridJustifyEditor()}
        {isGrid && renderGapEditor()}
      </Div>
      {disabled && <StylesDisabledOverlay />}
    </Accordion>
  )
}

export default StylesSubSectionLayout
