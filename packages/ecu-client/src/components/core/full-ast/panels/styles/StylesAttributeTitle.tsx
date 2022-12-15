import { useCallback, useMemo } from 'react'
import { Div, DivProps } from 'honorable'
import { TbExclamationMark, TbExclamationMarkOff } from 'react-icons/tb'
import { BiUndo } from 'react-icons/bi'

import { CssAttributeType, NormalizedCssAttributesType } from '~types'

import { cssAttributesMap, cssValueReset } from '~constants'

import useStylesSubSectionHelpers from '~hooks/useStylesSubSectionHelpers'

type StylesSubSectionAttributeTitlePropsType = DivProps & {
  attributes: NormalizedCssAttributesType
  breakpointAttributes: NormalizedCssAttributesType
  currentBreakpointAttributes: NormalizedCssAttributesType
  attributeNames: string[]
  onChange: (attributes: CssAttributeType[]) => void
}

function StylesAttributeTitle({
  attributes,
  breakpointAttributes,
  currentBreakpointAttributes,
  attributeNames,
  width = 52,
  children,
  onChange,
  ...props
}: StylesSubSectionAttributeTitlePropsType) {
  const { getTextColor, createCssAttribute } = useStylesSubSectionHelpers(attributes, breakpointAttributes)

  const handleResetClick = useCallback(() => {
    // cssValueReset will tell PanelStyles to reset the style and delete the attribute
    onChange(attributeNames.map(name => createCssAttribute(name, cssValueReset, false)))
  }, [attributeNames, createCssAttribute, onChange])

  const isImportant = useMemo(() => attributeNames.some(attributeName => breakpointAttributes[attributeName]?.isImportant), [attributeNames, breakpointAttributes])
  const isResetable = useMemo(() => attributeNames.some(attributeName => currentBreakpointAttributes[attributeName] && currentBreakpointAttributes[attributeName].value !== cssAttributesMap[attributeName].defaultValue), [attributeNames, currentBreakpointAttributes])
  const color = getTextColor(attributeNames)

  const handleImportantClick = useCallback(() => {
    onChange(
      attributeNames
        .map(attributeName => breakpointAttributes[attributeName] ?? createCssAttribute(attributeName, cssAttributesMap[attributeName].defaultValue, false))
        .filter(attribute => attribute)
        .map(attribute => ({ ...attribute, isImportant: !isImportant }))
    )
  }, [isImportant, attributeNames, breakpointAttributes, createCssAttribute, onChange])

  return (
    <Div
      xflex="x4"
      position="relative"
      width={width}
      minWidth={width}
      maxWidth={width}
      color={color}
      textDecoration={isResetable ? 'underline' : 'none'}
      textDecorationThickness={0.5}
      textUnderlineOffset={2}
      textDecor
      _hover={{
        '> #StylesSubSectionAttributeTitle-reset': {
          display: 'flex',
        },
        '> #StylesSubSectionAttributeTitle-important': {
          display: 'flex',
        },
      }}
      {...props}
    >
      <Div
        flexGrow
        ellipsis
      >
        {children}
        {isImportant ? '!' : ''}
      </Div>
      <Div
        id="StylesSubSectionAttributeTitle-important"
        xflex="x5"
        display="none"
        cursor="pointer"
        color="primary"
        title={`Mark as${isImportant ? ' not' : ''} important`}
        px={0.25}
        onClick={handleImportantClick}
      >
        {isImportant ? <TbExclamationMarkOff /> : <TbExclamationMark />}
      </Div>
      {isResetable && (
        <Div
          id="StylesSubSectionAttributeTitle-reset"
          xflex="x5"
          display="none"
          cursor="pointer"
          color="danger"
          title="Reset to no value"
          px={0.25}
          onClick={handleResetClick}
        >
          <BiUndo />
        </Div>
      )}
    </Div>
  )
}

export default StylesAttributeTitle
