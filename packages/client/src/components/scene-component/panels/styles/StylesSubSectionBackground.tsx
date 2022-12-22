import { ReactNode, memo, useCallback, useContext } from 'react'
import { Accordion, Div } from 'honorable'

import StylesContext from '~contexts/StylesContext'

import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'
import usePersistedState from '~hooks/usePersistedState'

import StylesTitle from '~components/scene-component/panels/styles/StylesTitle'
import StylesAttributeTitle from '~components/scene-component/panels/styles/StylesAttributeTitle'
import StylesDisabledOverlay from '~components/scene-component/panels/styles/StylesDisabledOverlay'
import StylesList from '~components/scene-component/panels/styles/StylesList'
import ColorPicker from '~components/css-inputs/ColorPicker'

const attributeNames = [
  'background',
  'background-color',
]

function StylesSubSectionBackground() {
  const { onChange } = useContext(StylesContext)
  const [expanded, setExpanded] = usePersistedState('styles-sub-section-background-expanded', true)

  const { getValue, updateCssAttribute } = useStylesSubSectionHelpers()

  const renderBackgroundColorSection = useCallback(() => (
    <Div xflex="x4s">
      <StylesAttributeTitle attributeNames={['background-color']}>
        Color
      </StylesAttributeTitle>
      <ColorPicker
        withOverlay
        value={getValue('background-color')}
        onChange={color => onChange([updateCssAttribute('background-color', color)])}
        pickerLeftOffset={-29} // Adjusted from sight
      />
    </Div>
  ), [getValue, updateCssAttribute, onChange])

  const renderBackgroundSection = useCallback(() => {
    const items: ReactNode[] = []

    return (
      <StylesList
        title="Image and gradient"
        attributeName="background"
        items={items}
        onAddItem={() => {}}
      />
    )
  }, [])

  return (
    <Accordion
      ghost
      backgroundTitle
      smallTitle
      smallTitlePadding
      noChildrenPadding
      childrenPositionRelative
      expanded={expanded}
      onExpand={setExpanded}
      title={(
        <StylesTitle
          title="Background"
          expanded={expanded}
          attributeNames={attributeNames}
        />
      )}
    >
      <Div
        xflex="y2s"
        fontSize="0.75rem"
        gap={0.5}
        p={0.5}
      >
        {renderBackgroundColorSection()}
      </Div>
      {renderBackgroundSection()}
      <StylesDisabledOverlay />
    </Accordion>
  )
}

export default memo(StylesSubSectionBackground)
