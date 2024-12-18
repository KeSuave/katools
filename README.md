katools
=================

A set of tools to help you focus on what matters most by taking care of the repetitive work.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/katools.svg)](https://npmjs.org/package/katools)
[![Downloads/week](https://img.shields.io/npm/dw/katools.svg)](https://npmjs.org/package/katools)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g katools
$ katools COMMAND
running command...
$ katools (--version)
katools/0.0.0 win32-x64 node-v20.11.1
$ katools --help [COMMAND]
USAGE
  $ katools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`katools component [FILE]`](#katools-component-file)
* [`katools entity [FILE]`](#katools-entity-file)
* [`katools help [COMMAND]`](#katools-help-command)
* [`katools init [FILE]`](#katools-init-file)
* [`katools plugins`](#katools-plugins)
* [`katools plugins add PLUGIN`](#katools-plugins-add-plugin)
* [`katools plugins:inspect PLUGIN...`](#katools-pluginsinspect-plugin)
* [`katools plugins install PLUGIN`](#katools-plugins-install-plugin)
* [`katools plugins link PATH`](#katools-plugins-link-path)
* [`katools plugins remove [PLUGIN]`](#katools-plugins-remove-plugin)
* [`katools plugins reset`](#katools-plugins-reset)
* [`katools plugins uninstall [PLUGIN]`](#katools-plugins-uninstall-plugin)
* [`katools plugins unlink [PLUGIN]`](#katools-plugins-unlink-plugin)
* [`katools plugins update`](#katools-plugins-update)
* [`katools scene [FILE]`](#katools-scene-file)

## `katools component [FILE]`

describe the command here

```
USAGE
  $ katools component [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ katools component
```

_See code: [src/commands/component.ts](https://github.com/KeSuave/katools/blob/v0.0.0/src/commands/component.ts)_

## `katools entity [FILE]`

describe the command here

```
USAGE
  $ katools entity [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ katools entity
```

_See code: [src/commands/entity.ts](https://github.com/KeSuave/katools/blob/v0.0.0/src/commands/entity.ts)_

## `katools help [COMMAND]`

Display help for katools.

```
USAGE
  $ katools help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for katools.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.19/src/commands/help.ts)_

## `katools init [FILE]`

Initializes a new KAPLAY project.

```
USAGE
  $ katools init [FILE] [-n <value>] [-t top-down|platformer]

ARGUMENTS
  FILE  file to read

FLAGS
  -n, --name=<value>       [default: My Game] Name of your game.
  -t, --template=<option>  [default: top-down] Game template to use.
                           <options: top-down|platformer>

DESCRIPTION
  Initializes a new KAPLAY project.

EXAMPLES
  $ katools init
```

_See code: [src/commands/init.ts](https://github.com/KeSuave/katools/blob/v0.0.0/src/commands/init.ts)_

## `katools plugins`

List installed plugins.

```
USAGE
  $ katools plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ katools plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/index.ts)_

## `katools plugins add PLUGIN`

Installs a plugin into katools.

```
USAGE
  $ katools plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into katools.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the KATOOLS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the KATOOLS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ katools plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ katools plugins add myplugin

  Install a plugin from a github url.

    $ katools plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ katools plugins add someuser/someplugin
```

## `katools plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ katools plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ katools plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/inspect.ts)_

## `katools plugins install PLUGIN`

Installs a plugin into katools.

```
USAGE
  $ katools plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into katools.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the KATOOLS_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the KATOOLS_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ katools plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ katools plugins install myplugin

  Install a plugin from a github url.

    $ katools plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ katools plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/install.ts)_

## `katools plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ katools plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ katools plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/link.ts)_

## `katools plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ katools plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ katools plugins unlink
  $ katools plugins remove

EXAMPLES
  $ katools plugins remove myplugin
```

## `katools plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ katools plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/reset.ts)_

## `katools plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ katools plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ katools plugins unlink
  $ katools plugins remove

EXAMPLES
  $ katools plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/uninstall.ts)_

## `katools plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ katools plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ katools plugins unlink
  $ katools plugins remove

EXAMPLES
  $ katools plugins unlink myplugin
```

## `katools plugins update`

Update installed plugins.

```
USAGE
  $ katools plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/update.ts)_

## `katools scene [FILE]`

describe the command here

```
USAGE
  $ katools scene [FILE] [-f] [-n <value>]

ARGUMENTS
  FILE  file to read

FLAGS
  -f, --force
  -n, --name=<value>  name to print

DESCRIPTION
  describe the command here

EXAMPLES
  $ katools scene
```

_See code: [src/commands/scene.ts](https://github.com/KeSuave/katools/blob/v0.0.0/src/commands/scene.ts)_
<!-- commandsstop -->
