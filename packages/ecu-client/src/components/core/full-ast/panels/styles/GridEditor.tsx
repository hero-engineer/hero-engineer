import { Div } from 'honorable'

import { CssAttributeType, NormalizedCssAttributesType } from '~types'

type GridEditorPropsType = {
  attributes: NormalizedCssAttributesType
  breakpointAttributes: NormalizedCssAttributesType
  onChange: (attributes: CssAttributeType[]) => void
}

function GridEditor({ attributes, breakpointAttributes, onChange }: GridEditorPropsType) {
  // const getValue = useCallback((attributeName: string) => breakpointCssValues[attributeName] ?? cssValues[attributeName] ?? cssAttributesMap[attributeName].defaultValue, [breakpointCssValues, cssValues])

  // const getTextColor = useCallback((attributeNames: string[]) => (
  //   attributeNames
  //   .map(attributeName => (
  //     typeof breakpointCssValues[attributeName] !== 'undefined'
  //     && breakpointCssValues[attributeName] !== cssValues[attributeName]
  //     && breakpointCssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue
  //       ? 'breakpoint'
  //       : typeof cssValues[attributeName] !== 'undefined'
  //       && cssValues[attributeName] !== cssAttributesMap[attributeName].defaultValue
  //         ? 'primary'
  //         : 'text-light'
  //   ))
  //     .reduce((acc, color) => color === 'breakpoint' ? color : color === 'primary' ? color : acc, 'text-light')
  // ), [breakpointCssValues, cssValues])

  // const isToggled = useCallback((attributeName: string, values: CssValueType[]) => values.includes(getValue(attributeName)), [getValue])

  // const renderGridAutoFlowEditor = useCallback(() => {
  //   const isDense = (breakpointCssValues['grid-auto-flow'] ?? cssValues['grid-auto-flow'] ?? '').toString().endsWith(' dense')

  //   return (
  //     <Div xflex="x4s">
  //       <Div
  //         xflex="x4"
  //         minWidth={54}
  //         fontSize="0.75rem"
  //         color={getTextColor(['grid-auto-flow'])}
  //       >
  //         Direction
  //       </Div>
  //       <Button
  //         ghost
  //         smallText
  //         toggled={isToggled('grid-auto-flow', ['row', 'row dense'])}
  //         onClick={() => onChange([{ name: 'grid-auto-flow', value: `row${isDense ? ' dense' : ''}` }])}
  //       >
  //         Horizontal
  //       </Button>
  //       <Button
  //         ghost
  //         smallText
  //         toggled={isToggled('grid-auto-flow', ['column', 'column dense'])}
  //         onClick={() => onChange([{ name: 'grid-auto-flow', value: `column${isDense ? ' dense' : ''}` }])}
  //       >
  //         Vertical
  //       </Button>
  //       <Button
  //         ghost
  //         smallText
  //         toggled={isDense}
  //         onClick={() => onChange([{
  //           name: 'grid-auto-flow',
  //           value: isDense ? (breakpointCssValues['grid-auto-flow'] ?? cssValues['grid-auto-flow']).toString().slice(0, -' dense'.length) : `${breakpointCssValues['grid-auto-flow'] ?? cssValues['grid-auto-flow'] ?? cssAttributesMap['grid-auto-flow'].defaultValue} dense`,
  //         }])}
  //       >
  //         Dense
  //       </Button>
  //     </Div>
  //   )
  // }, [cssValues, breakpointCssValues, onChange, isToggled, getTextColor])

  // const renderGridEditor = useCallback(() => (
  //   <Div
  //     xflex="x4s"
  //     mt={1}
  //   >
  //     renderGridEditor
  //   </Div>
  // ), [])

  return (
    <Div width="100%">
      {/* {renderGridAutoFlowEditor()}
      {renderGridEditor()} */}
    </Div>
  )
}

export default GridEditor
