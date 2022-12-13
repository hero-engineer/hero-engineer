import { mergeTheme } from 'honorable'
import defaultTheme from 'honorable-theme-default'
import mpRecipe from 'honorable-recipe-mp'
import gapRecipe from 'honorable-recipe-gap'
import mapperRecipe from 'honorable-recipe-mapper'
import xflexRecipe from 'honorable-recipe-xflex'

import { zIndexes } from '~constants'

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
    'background-light': {
      light: '#fafcff',
      dark: '#22293b',
    },
    'background-light-light': {
      light: 'darken(background-light, 8)',
      dark: 'lighten(background-light, 8)',
    },
    'background-light-dark': {
      light: 'lighten(background-light, 8)',
      dark: 'darken(background-light, 8)',
    },
    'background-component': {
      light: 'background-light',
      dark: 'background',
    },
    'background-styles-overlay': 'transparent',
    border: {
      light: 'darken(background-light, 10)',
      dark: 'lighten(background-light, 10)',
    },
    blue,
    green,
    yellow,
    red,
    grey,
    pink,
    info: 'blue.500',
    success: 'green.500',
    warning: 'yellow.500',
    danger: 'red.500',
    'drag-and-drop': 'green.500',
    'drag-and-drop-knob': 'green.500',
    'type-component': 'pink.500',
    'type-element': 'primary',
    'type-children': 'pink.500',
    'type-array': 'green.500',
    'type-text': 'grey.500',
    breakpoint: {
      light: 'yellow.600',
      dark: 'yellow.300',
    },
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
      {
        '&:first-of-type': {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        '&:last-of-type': {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
      ({ ghost }: any) => ghost && {
        elevation: 0,
        backgroundColor: 'transparent',
      },
      ({ bottomTabs }: any) => bottomTabs && {
        elevation: 0,
        borderBottom: null,
      },
    ],
    Title: [ // TODO rework with per-component semantic names
      ({ ghost }: any) => ghost && {
        height: 32, // To match the height of any ghost button
        paddingTop: 0,
        paddingBottom: 0,
        fontWeight: 500,
      },
      ({ bottomTabs }: any) => bottomTabs && {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: 'background-light',
      },
      ({ smallTitlePadding }: any) => smallTitlePadding && {
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
    ExpandIconWrapper: [
      ({ bottomTabs }: any) => bottomTabs && {
        marginLeft: 0,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottom: '1px solid border',
      },
    ],
    Children: [
      ({ ghost }: any) => ghost && {
        paddingLeft: 0,
        paddingRight: 0,
      },
      ({ noChildrenPadding, bottomTabs }: any) => (noChildrenPadding || bottomTabs) && {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
      ({ smallChildrenPadding }: any) => smallChildrenPadding && {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
      },
      ({ childrenPositionRelative }: any) => childrenPositionRelative && {
        position: 'relative',
      },
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
        border: '1px solid transparent',
        minHeight: 0,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        ':disabled': {
          backgroundColor: 'background-light-dark',
          ':hover': {
            backgroundColor: 'background-light-dark',
          },
        },
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
        lineHeight: '100%',
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
      ({ ghostBorder }: any) => ghostBorder && {
        border: '1px solid text',
        borderRadius: 'medium',
      },
      ({ slim }: any) => slim && {
        paddingTop: 0,
        paddingBottom: 0,
      },
      ({ small }: any) => small && {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
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
      ({ backgroundLightDark }: any) => backgroundLightDark && {
        backgroundColor: 'background-light-dark',
        '&:hover': {
          backgroundColor: 'darken(background-light-dark, 2)',
        },
        ':active': {
          backgroundColor: 'darken(background-light-dark, 4)',
        },
        ':disabled': {
          backgroundColor: 'darken(background-light-dark, 6)',
          '&:hover': {
            backgroundColor: 'darken(background-light-dark, 6)',
          },
        },
      },
      ({ backgroundBreakpoint }: any) => backgroundBreakpoint && {
        // @ts-expect-error
        color: defaultTheme.colors?.text.light,
        backgroundColor: 'breakpoint',
        '&:hover': {
          backgroundColor: 'darken(breakpoint, 2)',
        },
        ':active': {
          backgroundColor: 'darken(breakpoint, 4)',
        },
        ':disabled': {
          backgroundColor: 'darken(breakpoint, 6)',
          '&:hover': {
            backgroundColor: 'darken(breakpoint, 6)',
          },
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
        paddingLeft: 0,
        paddingRight: 0,
      },
    ],
    InputBase: [
      ({ bare }: any) => bare && {
        lineHeight: 'inherit',
      },
      ({ slim }: any) => slim && {
        lineHeight: 'inherit',
      },
      ({ disabledNoBackground, disabled }: any) => disabledNoBackground && disabled && {
        backgroundColor: 'transparent',
      },
    ],
    TextArea: [
      ({ bare }: any) => bare && {
        lineHeight: 'inherit',
        paddingTop: 0,
        paddingBottom: 0,
      },
    ],
    StartIcon: [
      ({ noStartIconPadding }: any) => noStartIconPadding && {
        paddingRight: 0,
      },
    ],
    EndIcon: [
      ({ noEndIconPadding }: any) => noEndIconPadding && {
        paddingLeft: 0,
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
  Modal: {
    Root: [
      {
        zIndex: zIndexes.modal,
      },
    ],
    Backdrop: [
      {
        zIndex: zIndexes.modal - 1,
      },
    ],
  },
  Select: {
    Root: [
      ({ slim }: any) => slim && {
        height: 32,
      },
      ({ tiny }: any) => tiny && {
        height: 24,
      },
    ],
    Selected: [
      ({ slim, tiny }: any) => (slim || tiny) && {
        paddingBottom: 2,
      },
    ],
  },
  Tooltip: {
    Root: [
      {
        backgroundColor: 'darken(background-light, 8)',
        color: 'text',
        border: '1px solid border',
        zIndex: zIndexes.tooltip,
      },
    ],
  },
  TreeView: {
    Label: [
      {
        marginTop: 8,
      },
    ],
  },
  Slider: {
    Root: [
      ({ slim }: any) => slim && {
        height: 4,
      },
    ],
    Knob: [
      ({ backgroundBreakpoint }: any) => backgroundBreakpoint && {
        backgroundColor: 'breakpoint',
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
