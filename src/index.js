#!/usr/bin/env node

import {
  first,
  includes,
  indexOf,
  property,
  slice,
} from '@dword-design/functions'
import execa from 'execa'
import P from 'path'

const run = async () => {
  const volumeToCliArg = volume => {
    switch (volume.Type) {
      case 'volume':
        return `${volume.Name}:${volume.Destination}`
      case 'bind':
        return `${volume.Source}:${volume.Destination}`
      default:
        throw new Error(`Unknown mount type '${volume.Type}`)
    }
  }
  const args = process.argv |> slice(2)
  const nameIndex = args |> indexOf('--name')
  const containerName =
    nameIndex === -1 ? P.basename(process.cwd()) : args[nameIndex + 1]
  if (nameIndex !== -1) {
    args.splice(nameIndex, 2)
  }
  const previousContainerName = `${containerName}_old`
  let containerData
  try {
    containerData =
      execa.command(`docker container inspect ${containerName}`, {
        all: true,
      })
      |> await
      |> property('all')
      |> JSON.parse
      |> first
  } catch {
    // Do nothing
  }
  if (containerData !== undefined) {
    let volumeIndex = 0
    args.forEach((arg, index) => {
      if (['-v', '--volume'] |> includes(arg)) {
        args[index + 1] = volumeToCliArg(containerData.Mounts[volumeIndex])
        volumeIndex += 1
      }
    })
    await execa.command(
      `docker container rename ${containerName} ${previousContainerName}`
    )
  }
  try {
    await execa('docker', [
      'container',
      'create',
      '--name',
      containerName,
      ...args,
    ])
  } finally {
    if (containerData !== undefined) {
      await execa.command(`docker container rm ${previousContainerName}`)
    }
  }
  await new Promise(resolve => setTimeout(resolve, 2000))
  await execa.command(`docker start ${containerName} -a`, {
    stdio: 'inherit',
  })
}
run()

// babel-node test2.js alekzonder/puppeteer:latest "ls -la node_modules && touch node_modules/foo.txt" -v $(pwd):/app -v /app/node_modules --user root --tty
