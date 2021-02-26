<!-- TITLE/ -->
# docker-multirun
<!-- /TITLE -->

<!-- BADGES/ -->
[![NPM version](https://img.shields.io/npm/v/docker-multirun.svg)](https://npmjs.org/package/docker-multirun)
![Linux macOS Windows compatible](https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue)
[![Build status](https://github.com/dword-design/docker-multirun/workflows/build/badge.svg)](https://github.com/dword-design/docker-multirun/actions)
[![Coverage status](https://img.shields.io/coveralls/dword-design/docker-multirun)](https://coveralls.io/github/dword-design/docker-multirun)
[![Dependency status](https://img.shields.io/david/dword-design/docker-multirun)](https://david-dm.org/dword-design/docker-multirun)
![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)

<a href="https://gitpod.io/#https://github.com/dword-design/bar">
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
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Run a docker container via docker-run multiple times. Works like docker-compose by keeping the container and reusing the volumes.
<!-- /DESCRIPTION -->

There are many cases where you run a task repeatedly, but do not want to throw away the whole container. One frequent task is running tests in a docker container. You want to keep the installed node_modules files and then run the tests multiple times.

`docker-multirun` is like [docker-run](https://docs.docker.com/engine/reference/run/), but reuses the volumes of the already-existing container. This way, generated files from the previous run are kept. This behavior is also known from [docker-compose](https://docs.docker.com/compose/).

<!-- INSTALL/ -->
## Install

```bash
# NPM
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
## License

Unless stated otherwise all works are:

Copyright &copy; Sebastian Landwehr <info@dword-design.de>

and licensed under:

[MIT License](https://opensource.org/licenses/MIT)
<!-- /LICENSE -->
