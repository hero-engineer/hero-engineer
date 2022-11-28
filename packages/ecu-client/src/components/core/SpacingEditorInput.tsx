import { Ref, RefObject, forwardRef, useCallback } from 'react'
import { Button, Div, Slider } from 'honorable'
import { CgUndo } from 'react-icons/cg'

import { CssValueType } from '../../types'
import splitSpacingValue from '../../utils/splitSpacingValue'

import CssValueInput from './CssValueInput'

type SpacingEditorInputPropsType = {
  title: string
  value: CssValueType
  onChange: (value: CssValueType) => void
  allowNegativeValues?: boolean
}

const designTokens = [
  'auto',
  '2px',
  '4px',
  '8px',
  '16px',
  '32px',
  '64px',
  '96px',
]

function SpacingEditorInputRef({ title, value, onChange, allowNegativeValues }: SpacingEditorInputPropsType, ref: Ref<any>) {
  const [rawValue, unit] = splitSpacingValue(value)
  const numericValue = parseInt(rawValue)

  const handleSliderChange = useCallback((_event: any, value: number) => {
    if (unit === 'auto') return

    onChange(`${value}${unit}`)
  }, [onChange, unit])

  const handleDesignTokenClick = useCallback((designToken: string) => {
    onChange(designToken)
  }, [onChange])

  const handleReset = useCallback(() => {
    onChange(0)
  }, [onChange])

  if (typeof value === 'undefined') return null

  return (
    <Div
      ref={ref}
      xflex="y2s"
      width="100%"
      fontSize="0.75rem"
      borderRadius="medium"
      p={0.5}
    >
      <Div color="text-light">
        {title}
        :
      </Div>
      <Div
        xflex="x4"
        gap={0.75}
        mt={0.25}
      >
        <Div
          xflex="x5"
          cursor="pointer"
          _hover={{ color: 'primary' }}
          onClick={handleReset}
          p={0.25}
        >
          <CgUndo />
        </Div>
        <Slider
          slim
          min={allowNegativeValues ? -128 : 0}
          max={128}
          step={1}
          knobSize={12}
          defaultValue={numericValue === numericValue ? numericValue : 0}
          onChange={handleSliderChange}
          disabled={unit === 'auto'}
        />
        <CssValueInput
          value={value.toString()}
          onChange={onChange}
        />
      </Div>
      <Div
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        columnGap={4}
        rowGap={4}
        mt={0.5}
      >
        {designTokens.map(designToken => (
          <Button
            key={designToken}
            slim
            onClick={() => handleDesignTokenClick(designToken)}
            py={0.25 / 2}
          >
            {designToken}
          </Button>
        ))}
      </Div>
    </Div>
  )
}

export default forwardRef(SpacingEditorInputRef)
