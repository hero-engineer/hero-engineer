import { mergeTheme } from 'honorable'
import defaultTheme from 'honorable-theme-default'
import mpRecipe from 'honorable-recipe-mp'
import gapRecipe from 'honorable-recipe-gap'
import mapperRecipe from 'honorable-recipe-mapper'
import xflexRecipe from 'honorable-recipe-xflex'

const borderRadiuses = {
  none: 0,
  medium: 3,
  large: 6,
}

const blue = {
  50: '#7e97ff',
  100: '#748dff',
  200: '#6a83ff',
  300: '#6079ff',
  400: '#566fff',
  500: '#4c65f5',
  600: '#425beb',
  700: '#3851e1',
  800: '#2e47d7',
  900: '#243dcd',
}

const yellow = {
  900: '#74480F',
  800: '#89580A',
  700: '#A67202',
  600: '#D19F00',
  500: '#EFCA00',
  400: '#FFE60D',
  300: '#FFF541',
  200: '#FFFE86',
  100: '#FEFFC1',
  50: '#FFFFE7',
}

const green = {
  950: '#032117',
  900: '#053827',
  850: '#074F37',
  800: '#0A6B4A',
  700: '#0F996A',
  600: '#13C386',
  500: '#17E8A0',
  400: '#3CECAF',
  300: '#6AF1C2',
  200: '#99F5D5',
  100: '#C7FAE8',
  50: '#F1FEF9',
}

const red = {
  950: '#130205',
  900: '#200308',
  850: '#38060E',
  800: '#660A19',
  700: '#8B0E23',
  600: '#BA1239',
  500: '#E81748',
  400: '#ED456A',
  300: '#F2788D',
  200: '#F599A8',
  100: '#FAC7D0',
  50: '#FFF0F2',
}

const grey = {
  50: '#f6f6f7',
  100: '#e0e2e7',
  200: '#c1c2ce',
  300: '#9a9cae',
  400: '#75768c',
  500: '#5a5b72',
  600: '#47485a',
  700: '#3b3b4a',
  800: '#32323d',
  900: '#101013',
}

const pink = {
  50: '#fef1fa',
  100: '#fde6f6',
  200: '#feccef',
  300: '#ffa2e2',
  400: '#fd66cb',
  500: '#f73db4',
  600: '#e81a94',
  700: '#ca0c77',
  800: '#a60e61',
  900: '#8a1154',
}

export default mergeTheme(defaultTheme, {
  name: 'Ecu',
  stylesheet: {
    html: [
      {
        overscrollBehaviorX: 'none',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
      },
    ],
    body: [
      {
        overflow: 'hidden',
        overscrollBehaviorX: 'none',
      },
    ],
    a: [
      {
        color: 'primary',
      },
    ],
    'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': [
      {
        WebkitAppearance: 'none',
        margin: 0,
      },
    ],
    'input[type=number]': [
      {
        MozAppearance: 'textfield',
      },
    ],
  },
  colors: {
    primary: 'blue.500',
    'background-light': '#fafcff',
    'background-component': 'background-light',
    border: 'darken(background-light, 10)',
    blue,
    green,
    yellow,
    red,
    grey,
    pink,
    'is-drop': 'green.500',
    'is-edited': 'darkorchid',
    'is-component-root': 'gold',
  },
  global: [
    mpRecipe(),
    gapRecipe(),
    xflexRecipe(),
    mapperRecipe('borderRadius', borderRadiuses),
    ({ flexGrow }: any) => flexGrow === true && { flexGrow: 1 },
    ({ ellipsis }: any) => ellipsis && {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  ],
  /* --
   * Tags
  --*/
  Div: {
    Root: [
      ({ cell }: any) => cell && {
        padding: 16,
      },
    ],
  },
  InputBase: {
    Root: [
      ({ ghost }: any) => ghost && {
        lineHeight: 'inherit',
      },
      ({ bare }: any) => bare && {
        lineHeight: 'inherit',
      },
    ],
  },
  Label: {
    Root: [
      {
        fontSize: 14,
        color: 'text-light',
        marginBottom: 0,
      },
    ],
  },
  H1: {
    Root: [
      {
        fontSize: '3rem',
      },
    ],
  },
  H2: {
    Root: [
      {
        fontSize: '2.5rem',
      },
    ],
  },
  H3: {
    Root: [
      {
        fontSize: '2rem',
      },
    ],
  },
  H4: {
    Root: [
      {
        fontSize: '1.5rem',
      },
    ],
  },
  H5: {
    Root: [
      {
        fontSize: '1.125rem',
      },
    ],
  },
  H6: {
    Root: [
      {
        fontSize: '1rem',
      },
    ],
  },
  Ol: {
    Root: [
      {
        margin: 0,
      },
    ],
  },
  Ul: {
    Root: [
      {
        margin: 0,
      },
    ],
  },
  /* --
   * Components
  --*/
  Accordion: {
    Root: [
      ({ ghost }: any) => ghost && {
        elevation: 0,
        backgroundColor: 'transparent',
      },
      {
        '&:first-of-type': {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        '&:last-of-type': {
          borderBottom: '1px solid border',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
    ],
    Title: [
      ({ ghost }: any) => ghost && {
        height: 30, // To match the height of the RetractablePanel toggle icon of 31px - 1px border
        paddingTop: 0,
        paddingBottom: 0,
        fontWeight: 500,
      },
      ({ smallPadding }: any) => smallPadding && {
        paddingLeft: 8,
        paddingRight: 8,
      },
      ({ smallTitle }: any) => smallTitle && {
        fontSize: '0.85rem',
      },
      ({ backgroundTitle, expanded, isExpanding }: any) => backgroundTitle && {
        backgroundColor: 'darken(background-light, 8)',
        borderBottom: expanded || isExpanding ? '1px solid border' : null,
      },
    ],
    Children: [
      ({ ghost }: any) => ghost && {
        paddingLeft: 0,
        paddingRight: 0,
      },
      ({ noChildrenPadding }: any) => noChildrenPadding && ({
        paddingBottom: 0,
      }),
      ({ smallPadding }: any) => smallPadding && ({
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
      }),
    ],
  },
  Autocomplete: {
    Input: [
      ({ bare }: any) => bare && {
        border: 'none',
        minHeight: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
    ],
    Menu: [
      ({ bare }: any) => bare && {
        top: 'calc(100% + 8px)',
      },
    ],
  },
  Button: {
    Root: [
      {
        borderRadius: 'medium',
        minHeight: 0,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
      },
      ({ borderPrimary }: any) => borderPrimary && {
        border: '1px solid primary',
      },
      ({ secondary }: any) => secondary && {
        backgroundColor: 'transparent',
        color: 'primary',
        border: '1px solid primary',
        '&:hover': {
          backgroundColor: 'transparency(primary, 88)',
        },
        '&:active': {
          backgroundColor: 'transparency(primary, 82)',
        },
        ':disabled': {
          backgroundColor: 'transparency(primary, 76)',
          ':hover': {
            backgroundColor: 'transparency(primary, 76)',
          },
        },
      },
      ({ ghost }: any) => ghost && {
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 0,
        color: 'text',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: 'darken(background-light, 2)',
        },
        ':active': {
          backgroundColor: 'darken(background-light, 4)',
        },
        ':disabled': {
          backgroundColor: 'darken(background-light, 6)',
          '&:hover': {
            backgroundColor: 'darken(background-light, 6)',
          },
        },
      },
      ({ ghost, toggled }: any) => ghost && toggled && {
        backgroundColor: 'darken(background-light, 4)',
        ':hover': {
          backgroundColor: 'darken(background-light, 4)',
        },
        ':active': {
          backgroundColor: 'darken(background-light, 4)',
        },
      },
      ({ slim }: any) => slim && {
        paddingTop: 0,
        paddingBottom: 0,
      },
      ({ tiny }: any) => tiny && {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 4,
      },
      ({ smallText }: any) => smallText && {
        fontSize: '0.75rem',
      },
      ({ danger }: any) => danger && {
        backgroundColor: 'red.500',
        '&:hover': {
          backgroundColor: 'red.600',
        },
        '&:active': {
          backgroundColor: 'red.700',
        },
      },
    ],
  },
  Input: {
    Root: [
      ({ bare }: any) => bare && {
        paddingLeft: 0,
        paddingRight: 0,
        minHeight: 0,
        border: 'none',
        borderRadius: 0,
        width: 'unset',
      },
      ({ short }: any) => short && {
        minHeight: 0,
        width: 64,
        paddingLeft: 4,
        paddingRight: 4,
      },
    ],
    InputBase: [
      ({ bare }: any) => bare && {
        lineHeight: 'inherit',
      },
      ({ slim }: any) => slim && {
        lineHeight: 'inherit',
      },
    ],
    TextArea: [
      ({ bare }: any) => bare && {
        lineHeight: 'inherit',
        paddingTop: 0,
        paddingBottom: 0,
      },
    ],
  },
  Menu: {
    Root: [
      ({ ghost }: any) => ghost && {
        elevation: 0,
        backgroundColor: 'transparent',
        borderRadius: 0,
      },
    ],
  },
  MenuItem: {
    Children: [
      {
        minWidth: 0, // To allow ellipsis https://css-tricks.com/flexbox-truncated-text/
      },
      ({ active, ghost }: any) => active && ghost && {
        backgroundColor: 'darken(background-light, 4)',
      },
      ({ slim }: any) => slim && ({
        paddingTop: 6,
        paddingBottom: 6,
      }),
    ],
  },
  Select: {
    Root: [
      ({ slim }: any) => slim && {
        height: 32,
      },
    ],
    Selected: [
      ({ slim }: any) => slim && {
        paddingBottom: 2,
      },
    ],
  },
  Tooltip: {
    Root: [
      {
        backgroundColor: 'background-light',
        color: 'text',
        border: '1px solid border',
      },
    ],
  },
  Slider: {
    Root: [
      ({ slim }: any) => slim && {
        height: 4,
      },
    ],
    Track: [
      ({ slim }: any) => slim && {
        height: 4,
      },
    ],
  },
  Switch: {
    Control: [
      {
        backgroundColor: 'darken(background-light, 8)',
      },
      ({ checked }: any) => checked && {
        backgroundColor: 'primary',
      },
    ],
  },
})
