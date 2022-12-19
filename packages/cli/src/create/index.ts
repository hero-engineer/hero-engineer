import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { commit, initialCommitMessage } from '@hero-engineer/server'
import { findUpSync } from 'find-up'
import unzip from 'extract-zip'
import gitAuthor from 'git-author'

import installDependencies from './installDependencies.js'

async function createTemplate() {
  const cwd = process.cwd()

  console.log('Checking for git directory...')

  // Check if cwd is a git repository
  if (!fs.existsSync(path.join(cwd, '.git'))) {
    console.log('Creating git directory...')

    execSync('git init', { cwd })
  }

  const { name, email } = gitAuthor()

  if (!(name && email)) {
    throw new Error('Git author name and email are required, please update your git config')
  }

  console.log('Copying template files...')

  // Copy project-template
  const __dirname = fileURLToPath(new URL('.', import.meta.url))
  const zipPath = findUpSync('project-template.zip', { cwd: __dirname, type: 'file' })

  if (!zipPath) {
    throw new Error('Could not find project-template.zip')
  }

  await unzip(zipPath, { dir: cwd })

  const templateDirectoryPath = path.join(cwd, 'project-template')

  fs.cpSync(templateDirectoryPath, cwd, { recursive: true, force: true })
  fs.rmSync(templateDirectoryPath, { recursive: true, force: true })

  console.log('Installing root dependencies...')

  // Install dependencies in root folder
  installDependencies(cwd)

  console.log('Installing app dependencies...')

  // Install dependencies in app folder
  installDependencies(path.join(cwd, 'app'))

  console.log('Waiting for git to adjust...')

  await new Promise(resolve => {
    setTimeout(resolve, 3000)
  })

  console.log('Commiting...')

  // Perform initial commit
  await commit(cwd, initialCommitMessage)
}

export default createTemplate
