import { useCallback, useContext, useState } from 'react'
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

import CssValueInput from '~components/css-inputs/CssValueInput'
import GridModal from '~components/scene-component/panels/styles/GridModal'
import StylesTitle from '~components/scene-component/panels/styles/StylesTitle'
import StylesAttributeTitle from '~components/scene-component/panels/styles/StylesAttributeTitle'
import StylesDisabledOverlay from '~components/scene-component/panels/styles/StylesDisabledOverlay'

import StylesContext from '~contexts/StylesContext'

import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'
import usePersistedState from '~hooks/usePersistedState'

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

function StylesSubSectionLayout() {
  const { onChange } = useContext(StylesContext)
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-layout-expanded', true)
  const [isGridModalOpen, setIsGridModalOpen] = useState(false)

  const { getValue, isToggled, updateCssAttribute } = useStylesSubSectionHelpers()

  const renderDisplayEditor = useCallback(() => (
    <Div xflex="x4s">
      <StylesAttributeTitle attributeNames={['display']}>
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
            onClick={() => onChange([updateCssAttribute('display', name)])}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </Div>
  ), [isToggled, updateCssAttribute, onChange])

  const renderFlexDirectionEditor = useCallback(() => {
    const flexDirectionValue = getValue('flex-direction')
    const isReverse = flexDirectionValue.endsWith('-reverse')

    return (
      <Div
        xflex="x4s"
        fontSize="0.75rem"
      >
        <StylesAttributeTitle attributeNames={['flex-direction']}>
          Direction
        </StylesAttributeTitle>
        <Button
          ghost
          toggled={isToggled('flex-direction', ['row', 'row-reverse'])}
          onClick={() => onChange([updateCssAttribute('flex-direction', `row${isReverse ? '-reverse' : ''}`)])}
        >
          Horizontal
        </Button>
        <Button
          ghost
          toggled={isToggled('flex-direction', ['column', 'column-reverse'])}
          onClick={() => onChange([updateCssAttribute('flex-direction', `column${isReverse ? '-reverse' : ''}`)])}
        >
          Vertical
        </Button>
        <Tooltip
          label="Reverse"
        >
          <Button
            ghost
            toggled={isReverse}
            onClick={() => onChange([updateCssAttribute('flex-direction', isReverse ? flexDirectionValue.slice(0, -'-reverse'.length) : `${flexDirectionValue}-reverse`)])}
          >
            <MdOutlineSwapHoriz />
          </Button>
        </Tooltip>
      </Div>
    )
  }, [getValue, isToggled, updateCssAttribute, onChange])

  const renderFlexAlignEditor = useCallback(() => {
    const flexDirectionValue = getValue('flex-direction')

    return (
      <Div xflex="x1">
        <StylesAttributeTitle
          attributeNames={['align-items']}
          pt={0.25 / 2}
        >
          Align
        </StylesAttributeTitle>
        <Div
          display="grid"
          gridTemplateColumns="repeat(8, minmax(0, 1fr))"
        >
          {flexAligns.map(({ name, label, getIcon }) => {
            const Icon = getIcon(['row', 'row-reverse'].includes(flexDirectionValue))

            return (
              <Tooltip
                key={name}
                label={label}
              >
                <Button
                  ghost
                  tiny
                  toggled={isToggled('align-items', [name])}
                  onClick={() => onChange([updateCssAttribute('align-items', name)])}
                >
                  <Icon />
                </Button>
              </Tooltip>
            )
          })}
        </Div>
      </Div>
    )
  }, [getValue, isToggled, updateCssAttribute, onChange])

  const renderFlexJustifyEditor = useCallback(() => {
    const flexDirectionValue = getValue('flex-direction')

    return (
      <Div xflex="x1">
        <StylesAttributeTitle
          attributeNames={['justify-content']}
          pt={0.25 / 2}
        >
          Justify
        </StylesAttributeTitle>
        <Div
          display="grid"
          gridTemplateColumns="repeat(8, minmax(0, 1fr))"
        >
          {flexJustifys.map(({ name, label, getIcon }) => {
            const Icon = getIcon(['row', 'row-reverse'].includes(flexDirectionValue))

            return (
              <Tooltip
                key={name}
                label={label}
              >
                <Button
                  ghost
                  tiny
                  toggled={isToggled('justify-content', [name])}
                  onClick={() => onChange([updateCssAttribute('justify-content', name)])}
                >
                  <Icon />
                </Button>
              </Tooltip>
            )
          })}
        </Div>
      </Div>
    )
  }, [getValue, isToggled, updateCssAttribute, onChange])

  const renderGapEditor = useCallback(() => {
    const rowGapValue = getValue('row-gap')
    const columnGapValue = getValue('column-gap')

    return (
      <Div xflex="x1">
        <StylesAttributeTitle
          attributeNames={['column-gap', 'row-gap']}
          pt={0.25 / 2}
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
              value={rowGapValue}
              onChange={value => onChange([updateCssAttribute('row-gap', value)])}
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
              value={columnGapValue}
              onChange={value => onChange([updateCssAttribute('column-gap', value)])}
            />
            <Div color="text-light">
              Columns
            </Div>
          </Div>
        </Div>
      </Div>
    )
  }, [getValue, updateCssAttribute, onChange])

  const renderFlexWrapEditor = useCallback(() => {
    const flexWrapValue = getValue('flex-wrap')
    const isReverse = flexWrapValue === 'wrap-reverse'

    return (
      <Div
        xflex="x4s"
        minHeight={30} // For flex-wrap button not to change the layout
        fontSize="0.75rem"
      >
        <StylesAttributeTitle attributeNames={['flex-wrap']}>
          Wrap
        </StylesAttributeTitle>
        <Button
          ghost
          toggled={isToggled('flex-wrap', ['wrap', 'wrap-reverse'])}
          onClick={() => onChange([
            updateCssAttribute('flex-wrap', ['wrap', 'wrap-reverse'].includes(flexWrapValue) ? 'nowrap' : `wrap${isReverse ? '-reverse' : ''}`),
            updateCssAttribute('align-content', 'stretch'),
          ])}
        >
          Wrap
        </Button>
        {['wrap', 'wrap-reverse'].includes(flexWrapValue) && (
          <Tooltip
            label="Reverse"
          >
            <Button
              ghost
              toggled={isReverse}
              onClick={() => onChange([updateCssAttribute('flex-wrap', isReverse ? 'wrap' : 'wrap-reverse')])}
            >
              <MdOutlineSwapHoriz />
            </Button>
          </Tooltip>
        )}
      </Div>
    )
  }, [getValue, isToggled, updateCssAttribute, onChange])

  const renderFlexContentEditor = useCallback(() => {
    const alignContentValue = getValue('align-content')

    return (
      <Div xflex="x1">
        <StylesAttributeTitle
          attributeNames={['align-content']}
          pt={0.25 / 2}
        >
          Align
        </StylesAttributeTitle>
        <Div
          display="grid"
          gridTemplateColumns="repeat(8, minmax(0, 1fr))"
        >
          {flexAligns.map(({ name, label, getIcon }) => {
            const Icon = getIcon(['row', 'row-reverse'].includes(alignContentValue))

            return (
              <Tooltip
                key={name}
                label={label}
              >
                <Button
                  ghost
                  tiny
                  toggled={isToggled('align-content', [name])}
                  onClick={() => onChange([updateCssAttribute('align-content', name)])}
                >
                  <Icon />
                </Button>
              </Tooltip>
            )
          })}
        </Div>
      </Div>
    )
  }, [getValue, isToggled, updateCssAttribute, onChange])

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
      />
    </>
  ), [isGridModalOpen])

  const renderGridAlignEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['align-items', 'justify-items']}
        pt={0.5}
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
                onClick={() => onChange([updateCssAttribute('align-items', name)])}
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
                onClick={() => onChange([updateCssAttribute('justify-items', name)])}
              >
                <Icon />
              </Button>
            </Tooltip>
          )
        })}
      </Div>
    </Div>
  ), [isToggled, updateCssAttribute, onChange])

  const renderGridJustifyEditor = useCallback(() => (
    <Div xflex="x1">
      <StylesAttributeTitle
        attributeNames={['align-content', 'justify-content']}
        pt={0.5}
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
                onClick={() => onChange([updateCssAttribute('align-content', name)])}
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
                onClick={() => onChange([updateCssAttribute('justify-content', name)])}
              >
                <Icon />
              </Button>
            </Tooltip>
          )
        })}
      </Div>
    </Div>
  ), [isToggled, updateCssAttribute, onChange])

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
      <StylesDisabledOverlay />
    </Accordion>
  )
}

export default StylesSubSectionLayout
