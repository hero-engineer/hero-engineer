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
  50: '#eff9ff',
  100: '#def1ff',
  200: '#b6e5ff',
  300: '#75d3ff',
  400: '#2cbdff',
  500: '#00aaff',
  600: '#0083d4',
  700: '#0068ab',
  800: '#00588d',
  900: '#064974',
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
  name: 'WorldCollector',
  stylesheet: {
    html: [
      {
        overscrollBehaviorX: 'none',
      },
    ],
    body: [
      {
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        overscrollBehaviorX: 'none',
      },
    ],
    a: [
      {
        color: 'primary',
      },
    ],
  },
  colors: {
    primary: 'blue.500',
    blue,
    green,
    yellow,
    red,
    grey,
    pink,
  },
  global: [
    mpRecipe(),
    gapRecipe(),
    xflexRecipe(),
    mapperRecipe('borderRadius', borderRadiuses),
    ({ flexGrow }: any) => flexGrow === true && ({ flexGrow: 1 }),
  ],
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
        height: 32, // To match the height of the RetractablePanel toggle icon of 33px - 1px border
        paddingTop: 0,
        paddingBottom: 0,
        fontWeight: 500,
      },
    ],
    Children: [
      ({ ghost }: any) => ghost && {
        paddingLeft: 0,
        paddingRight: 0,
      },
    ],
  },
  Button: {
    Root: [
      ({ ghost }: any) => ghost && {
        minHeight: 0,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 0,
        color: 'text',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: 'darken(background-light, 3)',
        },
        ':active': {
          backgroundColor: 'darken(background-light, 6)',
        },
        ':disabled': {
          backgroundColor: 'darken(background-light, 9)',
          '&:hover': {
            backgroundColor: 'darken(background-light, 9)',
          },
        },
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
      ({ active, ghost }: any) => active && ghost && {
        backgroundColor: 'darken(background-light, 10)',
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
  Ol: {
    Root: [
      {
        margin: 0,
      },
    ],
  },
  Label: {
    Root: [
      {
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
  Input: {
    Root: [
      ({ ghost }: any) => ghost && ({
        paddingLeft: 0,
        paddingRight: 0,
        minHeight: 0,
      }),
    ],
    TextArea: [
      ({ ghost }: any) => ghost && ({
        paddingTop: 0,
        paddingBottom: 0,
      }),
    ],
  },
})
