#! /usr/bin/env node
import { Command } from 'commander'
import { serve } from '@hero-engineer/server'

import createTemplate from './create/index.js'

// The Hero Engineer cli
const program = new Command()

program
  .name('hero-engineer')
  .description('Self-reprogrammation rocks!')
  .version('0.0.0')

program.command('serve')
  .description('Starts an hero-engineer server instance')
  // .argument('<string>', 'string to split')
  // .option('--first', 'display just the first substring')
  // .option('-s, --separator <char>', 'separator character', ',')
  // .action((str, options) => {
  .action(async () => {
    await serve()
  })

program.command('create')
  .description('Creates a new hero-engineer project')
  // .argument('<string>', 'string to split')
  // .option('--first', 'display just the first substring')
  // .option('-s, --separator <char>', 'separator character', ',')
  // .action((str, options) => {
  .action(async () => {
    await createTemplate()
  })

program.parse()
