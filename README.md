<!-- TITLE/ -->
# docker-multirun
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/docker-multirun">
      <img
        src="https://img.shields.io/npm/v/docker-multirun.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/docker-multirun/actions">
      <img
        src="https://github.com/dword-design/docker-multirun/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/docker-multirun">
      <img
        src="https://codecov.io/gh/dword-design/docker-multirun/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/docker-multirun">
      <img src="https://img.shields.io/david/dword-design/docker-multirun" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/docker-multirun">
      <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod">
    </a><a href="https://www.buymeacoffee.com/dword">
      <img
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
        alt="Buy Me a Coffee"
        height="32"
      >
    </a><a href="https://paypal.me/SebastianLandwehr">
      <img
        src="https://dword-design.de/images/paypal.svg"
        alt="PayPal"
        height="32"
      >
    </a><a href="https://www.patreon.com/dworddesign">
      <img
        src="https://dword-design.de/images/patreon.svg"
        alt="Patreon"
        height="32"
      >
    </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Run a docker container via docker-run multiple times. Works like docker-compose by keeping the container and reusing the volumes.
<!-- /DESCRIPTION -->

There are many cases where you run a task repeatedly, but do not want to throw away the whole container. One frequent task is running tests in a docker container. You want to keep the installed node_modules files and then run the tests multiple times.

`docker-multirun` is like [docker-run](https://docs.docker.com/engine/reference/run/), but reuses the volumes of the already-existing container. This way, generated files from the previous run are kept. This behavior is also known from [docker-compose](https://docs.docker.com/compose/).

<!-- INSTALL/ -->
## Install

```bash
# npm
$ npm install docker-multirun

# Yarn
$ yarn add docker-multirun
```
<!-- /INSTALL -->

## Usage

```bash
# Using yarn
$ npx docker-multirun node:12 bash -c "npm ci && npm test"

# Using npm
$ yarn docker-multirun node:12 bash -c "yarn --frozen-lockfile && yarn test"

# Mounting volumes
$ yarn docker-multirun node:12 -v $(pwd):/app -v /app/node_modules bash -c "yarn --frozen-lockfile && yarn test"
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...

# Run it again
$ yarn docker-multirun node:12 -v $(pwd):/app -v /app/node_modules bash -c "yarn --frozen-lockfile && yarn test"
[1/4] 🔍  Resolving packages...
success Already up-to-date.

# That was the fast lane!
```

### Custom container name
You can give your container a custom name by using the `--name` option, which is part of [docker-run](https://docs.docker.com/engine/reference/run/).

<!-- LICENSE/ -->
## Contributing

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/docker-multirun/issues) or [pull request](https://github.com/dword-design/docker-multirun/pulls)! ⚙️

## Support Me

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      height="32"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://dword-design.de/images/paypal.svg"
      alt="PayPal"
      height="32"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://dword-design.de/images/patreon.svg"
      alt="Patreon"
      height="32"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://dword-design.de)
<!-- /LICENSE -->
