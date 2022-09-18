import { Particule } from 'ecu-particule'
import { ConfigurationType } from 'ecu-common'

// eslint-disable-next-line
export const configuration: ConfigurationType = require('ecu-configuration/config.js').default
// eslint-disable-next-line
export const plugins: Particule[] = require('ecu-configuration/plugins.js').default
