import { endent, identity, mapValues, property } from '@dword-design/functions'
import execa from 'execa'
import { outputFile } from 'fs-extra'
import P from 'path'
import { v4 as uuid } from 'uuid'
import withLocalTmpDir from 'with-local-tmp-dir'

const self = P.join('..', 'src', 'index.js')
const runTest = test => () =>
  withLocalTmpDir(async () => {
    try {
      await test()
    } finally {
      await execa
        .command(`docker container rm ${P.basename(process.cwd())}`)
        .catch(identity)
    }
  })

export default {
  bind: async () => {
    await outputFile('foo.txt', '')
    const output = await execa(
      self,
      ['-v', `${process.cwd()}:/app`, 'node:12', 'ls', '/app'],
      {
        all: true,
      }
    )
    expect(output.all).toEqual('foo.txt')
  },
  command: async () => {
    const output = await execa.command(`${self} node:12 echo foo`, {
      all: true,
    })
    expect(output.all).toEqual('foo')
  },
  'multiple commands': async () => {
    const output = await execa(
      self,
      ['node:12', 'bash', '-c', 'echo foo && echo bar'],
      {
        all: true,
      }
    )
    expect(output.all).toEqual(endent`
      foo
      bar
    `)
  },
  name: async () => {
    const name = uuid()
    try {
      const output = await execa.command(
        `${self} --name ${name} node:12 echo foo`,
        {
          all: true,
        }
      )
      await expect(
        execa.command(`docker container inspect ${P.basename(process.cwd())}`)
      ).rejects.toThrow()
      await execa.command(`docker container inspect ${name}`)
      expect(output.all).toEqual('foo')
    } finally {
      await execa.command(`docker container rm ${name}`).catch(identity)
    }
  },
  volume: async () => {
    const execution = async () =>
      execa(
        self,
        [
          '-v',
          '/app',
          'node:12',
          'bash',
          '-c',
          'ls /app && touch /app/bar.txt',
        ],
        {
          all: true,
        }
      )
      |> await
      |> property('all')
    expect(await execution()).toEqual('')
    expect(await execution()).toEqual('bar.txt')
  },
} |> mapValues(runTest)
