import { Ref, forwardRef, useState } from 'react'
import { Button, Div, Slider } from 'honorable'
import { CgUndo } from 'react-icons/cg'

import { SpacingType } from '../../types'
import splitCssValue from '../../utils/splitCssValue'

import CssValueInput from './CssValueInput'

type SpacingEditorInputPropsType = {
  title: string
  value: SpacingType,
  onChange: (value: SpacingType) => void,
  allowNegativeValues?: boolean,
}

const designTokens = [
  'auto',
  '2',
  '4',
  '8',
  '16',
  '32',
  '64',
  '96',
]

function SpacingEditorInputRef({ title, value, onChange, allowNegativeValues }: SpacingEditorInputPropsType, ref: Ref<any>) {
  const [rawValue] = splitCssValue(value)
  const numericValue = parseInt(rawValue)
  const [sliderValue, setSliderValue] = useState(numericValue === numericValue ? numericValue : 0)

  if (typeof value === 'undefined') return null

  console.log('allowNegativeValues', allowNegativeValues)

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
          p={0.25}
        >
          <CgUndo />
        </Div>
        {/* @ts-expect-error */}
        <Slider
          min={allowNegativeValues ? -128 : 0}
          max={128}
          step={1}
          value={sliderValue}
          onChange={(_event, value) => setSliderValue(value)}
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
