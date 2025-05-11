katools
=================

A set of tools to help you focus on what matters most by taking care of the repetitive work.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/katools.svg)](https://npmjs.org/package/katools)
[![Downloads/week](https://img.shields.io/npm/dw/katools.svg)](https://npmjs.org/package/katools)

## Guide

Follow the steps mentioned on this [blog post](https://kesuave.github.io/en/blog/katools/) to get started _(might be a bit outdated, but still works the same)_.

## Usage

```sh-session
npx katools COMMAND
```

or

<!-- usage -->
```sh-session
$ npm install -g katools
$ katools COMMAND
running command...
$ katools (--version)
katools/1.0.0 win32-x64 node-v20.18.1
$ katools --help [COMMAND]
USAGE
  $ katools COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g katools
$ katools COMMAND
running command...
$ katools (--version)
katools/0.11.0 linux-x64 node-v20.19.0
$ katools --help [COMMAND]
USAGE
  $ katools COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`katools component NAME`](#katools-component-name)
* [`katools entity NAME`](#katools-entity-name)
* [`katools help [COMMAND]`](#katools-help-command)
* [`katools init`](#katools-init)
* [`katools plugin NAME`](#katools-plugin-name)
* [`katools scene NAME`](#katools-scene-name)

## `katools component NAME`

Adds a new component to the project

```
USAGE
  $ katools component NAME [-d <value>] [-s <value>] [-j]

ARGUMENTS
  NAME  name of component

FLAGS
  -d, --dir=<value>     [default: components] directory to create the component in
  -j, --javascript      create a JavaScript plugin instead of TypeScript.
  -s, --subDir=<value>  subdirectory to create the component in

DESCRIPTION
  Adds a new component to the project

EXAMPLES
  $ katools component movement
```

_See code: [src/commands/component.ts](https://github.com/KeSuave/katools/blob/v1.0.0/src/commands/component.ts)_

## `katools entity NAME`

Adds a new entity to project

```
USAGE
  $ katools entity NAME [-d <value>] [-s <value>] [-j]

ARGUMENTS
  NAME  name of entity

FLAGS
  -d, --dir=<value>     [default: entities] directory to create the entity in
  -j, --javascript      create a JavaScript plugin instead of TypeScript.
  -s, --subDir=<value>  subdirectory to create the entity in

DESCRIPTION
  Adds a new entity to project

EXAMPLES
  $ katools entity player
```

_See code: [src/commands/entity.ts](https://github.com/KeSuave/katools/blob/v1.0.0/src/commands/entity.ts)_

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

## `katools init`

Initializes a new KAPLAY project.

```
USAGE
  $ katools init [-n <value>] [-s] [-j]

FLAGS
  -j, --javascript    create a JavaScript project instead of TypeScript.
  -n, --name=<value>  [default: katools] name of your game.
  -s, --skip          skip prompts and use default values.

DESCRIPTION
  Initializes a new KAPLAY project.

EXAMPLES
  $ katools init
```

_See code: [src/commands/init.ts](https://github.com/KeSuave/katools/blob/v1.0.0/src/commands/init.ts)_

## `katools plugin NAME`

adds a new plugin to the project

```
USAGE
  $ katools plugin NAME [-j]

ARGUMENTS
  NAME  name of plugin

FLAGS
  -j, --javascript  create a JavaScript plugin instead of TypeScript.

DESCRIPTION
  adds a new plugin to the project

EXAMPLES
  $ katools plugin score
```

_See code: [src/commands/plugin.ts](https://github.com/KeSuave/katools/blob/v1.0.0/src/commands/plugin.ts)_

## `katools scene NAME`

adds a scene to the project

```
USAGE
  $ katools scene NAME [-j]

ARGUMENTS
  NAME  name of scene

FLAGS
  -j, --javascript  create a JavaScript plugin instead of TypeScript.

DESCRIPTION
  adds a scene to the project

EXAMPLES
  $ katools scene game
```

_See code: [src/commands/scene.ts](https://github.com/KeSuave/katools/blob/v1.0.0/src/commands/scene.ts)_
<!-- commandsstop -->
* [`katools component NAME`](#katools-component-name)
* [`katools entity NAME`](#katools-entity-name)
* [`katools help [COMMAND]`](#katools-help-command)
* [`katools init`](#katools-init)
* [`katools plugin NAME`](#katools-plugin-name)
* [`katools scene NAME`](#katools-scene-name)

## `katools component NAME`

Adds a new component to the project

```
USAGE
  $ katools component NAME [-d <value>] [-s <value>]

ARGUMENTS
  NAME  name of component

FLAGS
  -d, --dir=<value>     [default: components] directory to create the component in
  -s, --subDir=<value>  subdirectory to create the component in

DESCRIPTION
  Adds a new component to the project

EXAMPLES
  $ katools component movement
```

_See code: [src/commands/component.ts](https://github.com/KeSuave/katools/blob/v0.11.0/src/commands/component.ts)_

## `katools entity NAME`

Adds a new entity to project

```
USAGE
  $ katools entity NAME [-d <value>] [-s <value>]

ARGUMENTS
  NAME  name of entity

FLAGS
  -d, --dir=<value>     [default: entities] directory to create the entity in
  -s, --subDir=<value>  subdirectory to create the entity in

DESCRIPTION
  Adds a new entity to project

EXAMPLES
  $ katools entity player
```

_See code: [src/commands/entity.ts](https://github.com/KeSuave/katools/blob/v0.11.0/src/commands/entity.ts)_

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

## `katools init`

Initializes a new KAPLAY project.

```
USAGE
  $ katools init [-n <value>] [-s]

FLAGS
  -n, --name=<value>  [default: katools] name of your game.
  -s, --skip          skip prompts and use default values.

DESCRIPTION
  Initializes a new KAPLAY project.

EXAMPLES
  $ katools init
```

_See code: [src/commands/init.ts](https://github.com/KeSuave/katools/blob/v0.11.0/src/commands/init.ts)_

## `katools plugin NAME`

adds a new plugin to the project

```
USAGE
  $ katools plugin NAME

ARGUMENTS
  NAME  name of plugin

DESCRIPTION
  adds a new plugin to the project

EXAMPLES
  $ katools plugin score
```

_See code: [src/commands/plugin.ts](https://github.com/KeSuave/katools/blob/v0.11.0/src/commands/plugin.ts)_

## `katools scene NAME`

adds a scene to the project

```
USAGE
  $ katools scene NAME

ARGUMENTS
  NAME  name of scene

DESCRIPTION
  adds a scene to the project

EXAMPLES
  $ katools scene game
```

_See code: [src/commands/scene.ts](https://github.com/KeSuave/katools/blob/v0.11.0/src/commands/scene.ts)_
<!-- commandsstop -->
