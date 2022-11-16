#! /usr/bin/env node
import { Command } from 'commander'
import { serve } from 'ecu-server'

import createEcuTemplate from './create/index.js'

const program = new Command()

program
  .name('ecu')
  .description('Self-reprogrammation rocks!')
  .version('0.0.0')

program.command('serve')
  .description('Starts an ecu-server instance')
  // .argument('<string>', 'string to split')
  // .option('--first', 'display just the first substring')
  // .option('-s, --separator <char>', 'separator character', ',')
  // .action((str, options) => {
  .action(async () => {
    await serve()
  })

program.command('create')
  .description('Creates a new ecu project')
  // .argument('<string>', 'string to split')
  // .option('--first', 'display just the first substring')
  // .option('-s, --separator <char>', 'separator character', ',')
  // .action((str, options) => {
  .action(async () => {
    await createEcuTemplate()
  })

program.parse()
