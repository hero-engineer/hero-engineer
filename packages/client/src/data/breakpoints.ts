import { BreakpointType } from '~types'

export default [
  {
    id: 'Desktop Large',
    name: 'Desktop Large',
    max: 999999999,
    min: 1280,
    base: 1280,
    scale: 1,
    media: 'screen and (min-width: 1280px)',
  },
  {
    id: 'Desktop',
    name: 'Desktop',
    max: 1279,
    min: 992,
    base: 1232,
    scale: 1,
    media: '',
  },
  {
    id: 'Tablet',
    name: 'Tablet',
    max: 991,
    min: 768,
    base: 768,
    scale: 1,
    media: 'screen and (max-width: 991px)',
  },
  {
    id: 'Mobile Landscape',
    name: 'Mobile Landscape',
    max: 767,
    min: 479,
    base: 568,
    scale: 1,
    media: 'screen and (max-width: 767px)',
  },
  {
    id: 'Mobile Portrait',
    name: 'Mobile Portrait',
    max: 478,
    min: 0,
    base: 320,
    scale: 1,
    media: 'screen and (max-width: 478px)',
  },
] as BreakpointType[]
