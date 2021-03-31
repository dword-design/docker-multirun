import {
  endent,
  filter,
  identity,
  join,
  mapValues,
  property,
  split,
} from '@dword-design/functions'
import execa from 'execa'
import { outputFile, rename } from 'fs-extra'
import pWaitFor from 'p-wait-for'
import P from 'path'
import { v4 as uuid } from 'uuid'
import withLocalTmpDir from 'with-local-tmp-dir'

const pathDelimiter = process.platform === 'win32' ? ';' : ':'

const getModifiedPath = () =>
  [
    ...(process.env.PATH
      |> split(pathDelimiter)
      |> filter(path => !['/bin', '/usr/bin'].includes(path))),
    process.cwd(),
  ] |> join(pathDelimiter)

const self = P.join('..', 'src', 'cli.js')

const runTest = test =>
  function () {
    return withLocalTmpDir(async () => {
      try {
        await test.call(this)
      } finally {
        await execa
          .command(`docker container rm ${P.basename(process.cwd())}`)
          .catch(() => {})
      }
    })
  }

export default {
  bind: async () => {
    await outputFile('foo.txt', '')
    await execa.command('docker pull node:12')

    const output = await execa(
      self,
      ['-v', `${process.cwd()}:/app`, 'node:12', 'ls', '/app'],
      {
        all: true,
      }
    )
    expect(output.all).toEqual('foo.txt')
  },
  'docker missing': async function () {
    let output
    try {
      await execa.command(self, {
        all: true,
        env: { PATH: getModifiedPath() },
        extendEnv: false,
      })
    } catch (error) {
      output = error.all
    }
    expect(output).toMatchSnapshot(this)
  },
  'error in creation': async function () {
    let output
    try {
      await execa.command(self, {
        all: true,
      })
    } catch (error) {
      output = error.all
    }
    expect(output).toMatchSnapshot(this)
  },
  'error in execution': async function () {
    await outputFile('foo.js', "throw new Error('foo')")
    let output
    try {
      await execa(
        self,
        ['-v', `${process.cwd()}:/app`, 'node:12', 'node', '/app/foo.js'],
        {
          all: true,
        }
      )
    } catch (error) {
      output = error.all
    }
    expect(output).toMatchSnapshot(this)
  },
  'existing old container': async () => {
    await execa.command(
      `docker container create --name ${P.basename(process.cwd())} node:12`
    )
    await execa.command(
      `docker container create --name ${P.basename(process.cwd())}_old node:12`
    )
    await execa.command(`${self} node:12`)
  },
  'folder moved': async () => {
    await outputFile('subdir/foo.js', '')
    await execa(
      P.join('..', self),
      [
        '--name',
        P.basename(process.cwd()),
        '-v',
        `${P.resolve('subdir')}:/app`,
        'node:12',
        'node',
        '/app/foo.js',
      ],
      { cwd: 'subdir' }
    )
    await rename('subdir', 'subdir2')
    await execa(
      P.join('..', self),
      [
        '--name',
        P.basename(process.cwd()),
        '-v',
        `${P.resolve('subdir2')}:/app`,
        'node:12',
        'node',
        '/app/foo.js',
      ],
      { cwd: 'subdir2', stdio: 'inherit' }
    )
  },
  'multiple calls with bind volume': async () => {
    const execution = () =>
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
    expect(execution() |> await |> property('all')).toEqual('')
    await execution()

    const childProcess = execution()
    await pWaitFor(async () => {
      try {
        await execa.command(
          `docker container inspect ${P.basename(process.cwd())}_old`
        )

        return true
      } catch {
        return false
      }
    })

    const output = await childProcess
    expect(output.all).toEqual('bar.txt')
    await execa.command(`docker container inspect ${P.basename(process.cwd())}`)
    await expect(
      execa.command(`docker container inspect ${P.basename(process.cwd())}_old`)
    ).rejects.toThrow()
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
  valid: async () => {
    const output = await execa.command(`${self} node:12 echo foo`, {
      all: true,
    })
    expect(output.all).toEqual('foo')
  },
} |> mapValues(runTest)
