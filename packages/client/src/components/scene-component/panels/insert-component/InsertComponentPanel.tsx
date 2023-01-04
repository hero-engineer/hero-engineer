import { Accordion, Div, P } from 'honorable'

import usePersistedState from '~hooks/usePersistedState'

import HtmlTag from '~components/scene-component/panels/insert-component/HtmlTag'

import htmlTags from '~data/htmlTags'

function InsertComponentPanel() {
  const [tagsExpanded, setTagsExpanded] = usePersistedState('insert-component-panel-tags-expanded', true)

  return (
    <Div
      xflex="y2s"
      flexGrow
      width={256 - 1} // Minus 1 to align with the top bar
      overflowY="auto"
    >
      <P
        fontWeight="bold"
        userSelect="none"
        px={1}
        my={0.5}
      >
        Insert component
      </P>
      <Accordion
        ghost
        backgroundTitle
        smallTitle
        smallTitlePadding
        smallChildrenPadding
        childrenPositionRelative
        expanded={tagsExpanded}
        onExpand={setTagsExpanded}
        title={(
          <Div xflex="x4">
            HTML tags
          </Div>
        )}
        borderTop="1px solid border"
      >
        <Div
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap={1}
        >
          {htmlTags.map(tag => (
            <HtmlTag
              key={tag}
              tag={tag}
            />
          ))}
        </Div>
      </Accordion>
    </Div>
  )
}

export default InsertComponentPanel
