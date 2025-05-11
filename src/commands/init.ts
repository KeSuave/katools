import {Command, Flags} from '@oclif/core'
import fs from 'node:fs'
import path from 'node:path'

import {confirm, input, number} from '@inquirer/prompts'
import contextTemplate from '../templates/context.js'
import pluginManagerTemplate from '../templates/plugins/manager.js'
import bootSceneTemplate from '../templates/scenes/boot.js'
import gameOverSceneTemplate from '../templates/scenes/game-over.js'
import gameSceneTemplate from '../templates/scenes/game.js'
import sceneManagerTemplate from '../templates/scenes/manager.js'
import menuSceneTemplate from '../templates/scenes/menu.js'
import Template from '../thirdparty/template.js'
import {projectPath, writeCodeFile} from '../utils.js'

interface GameContextOptions {
  width: number
  height: number
  letterbox: boolean
  debugKey: string
}

export default class Init extends Command {
  private tpl = new Template({
    close: '%>',
    open: '<%',
  })

  static override description = 'Initializes a new KAPLAY project.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    name: Flags.string({char: 'n', default: path.basename(process.cwd()), description: 'name of your game.'}),
    skip: Flags.boolean({char: 's', description: 'skip prompts and use default values.'}),
    javascript: Flags.boolean({
      char: 'j',
      default: false,
      description: 'uses JavaScript instead of TypeScript',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Init)
    const gameName = flags.name

    this.checkFolderStructure()

    const gameContextOptions: GameContextOptions = {
      width: 640,
      height: 360,
      letterbox: true,
      debugKey: 'u',
    }

    if (!flags.skip) {
      await this.askGameContextOptions(gameContextOptions)
    }

    this.writeGameContext(gameContextOptions, flags.javascript)
    this.writeSceneManager(flags.javascript)
    this.writeBootScene(flags.javascript)
    this.writeMenuScene(gameName, flags.javascript)
    this.writeGameScene(flags.javascript)
    this.writeGameOverScene(flags.javascript)
    this.writePluginManager(flags.javascript)

    this.log('Game initialized successfully!')
  }

  private checkFolderStructure(): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'scenes'))) {
      fs.mkdirSync(projectPath('src', 'scenes'))
    }

    if (!fs.existsSync(projectPath('src', 'plugins'))) {
      fs.mkdirSync(projectPath('src', 'plugins'))
    }
  }

  private async askGameContextOptions(options: GameContextOptions): Promise<void> {
    options.width =
      (await number({message: 'Enter the width of your game:', default: options.width, required: true})) ??
      options.width
    options.height =
      (await number({message: 'Enter the height of your game:', default: options.height, required: true})) ??
      options.height
    options.letterbox = await confirm({
      message: 'Would you like to use letterboxing?',
      default: options.letterbox,
    })
    options.debugKey = await input({
      message: 'Enter the debug key for your game:',
      default: options.debugKey,
      required: true,
      validate: (value) => value !== '' && value.length === 1,
    })
  }

  private writeGameContext(options: GameContextOptions, js: boolean): void {
    const template = this.tpl.render(contextTemplate, {
      width: options.width,
      height: options.height,
      letterbox: options.letterbox ? 'true' : 'false',
      debugKey: options.debugKey,
    })

    writeCodeFile(projectPath('src', 'context.ts'), template, js)
  }

  private writeSceneManager(js: boolean): void {
    const template = sceneManagerTemplate

    writeCodeFile(projectPath('src', 'scenes', 'index.ts'), template, js)
  }

  private writeBootScene(js: boolean): void {
    const template = bootSceneTemplate

    writeCodeFile(projectPath('src', 'scenes', 'boot.ts'), template, js)
  }

  private writeMenuScene(gameName: string, js: boolean): void {
    const template = this.tpl.render(menuSceneTemplate, {gameName})

    writeCodeFile(projectPath('src', 'scenes', 'menu.ts'), template, js)
  }

  private writeGameScene(js: boolean): void {
    const template = gameSceneTemplate

    writeCodeFile(projectPath('src', 'scenes', 'game.ts'), template, js)
  }

  private writeGameOverScene(js: boolean): void {
    const template = gameOverSceneTemplate

    writeCodeFile(projectPath('src', 'scenes', 'gameOver.ts'), template, js)
  }

  private writePluginManager(js: boolean): void {
    const template = pluginManagerTemplate

    writeCodeFile(projectPath('src', 'plugins', 'index.ts'), template, js)
  }
}
