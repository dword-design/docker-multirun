import {
  first,
  includes,
  indexOf,
  property,
  slice,
} from '@dword-design/functions'
import execa from 'execa'
import P from 'path'

export default async () => {
  const args = process.argv |> slice(2)

  const nameIndex = args |> indexOf('--name')

  const containerName =
    nameIndex === -1 ? P.basename(process.cwd()) : args[nameIndex + 1]
  if (nameIndex !== -1) {
    args.splice(nameIndex, 2)
  }

  const previousContainerName = `${containerName}_old`
  try {
    await execa.command('docker version', { stderr: 'inherit' })
  } catch (error) {
    console.error(error.message)
    throw error
  }
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
        const volume = containerData.Mounts[volumeIndex]
        if (volume.Type === 'volume') {
          args[index + 1] = `${volume.Name}:${volume.Destination}`
        }
        volumeIndex += 1
      }
    })
    try {
      await execa.command(
        `docker container rename ${containerName} ${previousContainerName}`
      )
    } catch {
      await execa.command(`docker container rm -f ${previousContainerName}`)
      await execa.command(
        `docker container rename ${containerName} ${previousContainerName}`
      )
    }
  }
  try {
    await execa(
      'docker',
      ['container', 'create', '--name', containerName, ...args],
      { stderr: 'inherit' }
    )
  } finally {
    if (containerData !== undefined) {
      await execa.command(`docker container rm ${previousContainerName}`)
    }
  }
  await execa.command(`docker start ${containerName} -a`, {
    stdio: 'inherit',
  })
}
