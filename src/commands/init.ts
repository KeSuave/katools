import {Command, Flags} from '@oclif/core'
import fs from 'node:fs'
import path from 'node:path'

import {confirm, input, number} from '@inquirer/prompts'
import Template from '../template.js'
import contextTemplate from '../templates/context.js'
import pluginManagerTemplate from '../templates/plugins/manager.js'
import bootSceneTemplate from '../templates/scenes/boot.js'
import gameOverSceneTemplate from '../templates/scenes/game-over.js'
import gameSceneTemplate from '../templates/scenes/game.js'
import sceneManagerTemplate from '../templates/scenes/manager.js'
import menuSceneTemplate from '../templates/scenes/menu.js'
import {projectPath} from '../utils.js'

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

    this.writeGameContext(gameContextOptions)
    this.writeSceneManager()
    this.writeBootScene()
    this.writeMenuScene(gameName)
    this.writeGameScene()
    this.writeGameOverScene()
    this.writePluginManager()

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

  private writeGameContext(options: GameContextOptions): void {
    const template = this.tpl.render(contextTemplate, {
      width: options.width,
      height: options.height,
      letterbox: options.letterbox ? 'true' : 'false',
      debugKey: options.debugKey,
    })

    fs.writeFileSync(projectPath('src', 'context.ts'), template)
  }

  private writeSceneManager(): void {
    const template = sceneManagerTemplate

    fs.writeFileSync(projectPath('src', 'scenes', 'index.ts'), template)
  }

  private writeBootScene(): void {
    const template = bootSceneTemplate

    fs.writeFileSync(projectPath('src', 'scenes', 'boot.ts'), template)
  }

  private writeMenuScene(gameName: string): void {
    const template = this.tpl.render(menuSceneTemplate, {gameName})

    fs.writeFileSync(projectPath('src', 'scenes', 'menu.ts'), template)
  }

  private writeGameScene(): void {
    const template = gameSceneTemplate

    fs.writeFileSync(projectPath('src', 'scenes', 'game.ts'), template)
  }

  private writeGameOverScene(): void {
    const template = gameOverSceneTemplate

    fs.writeFileSync(projectPath('src', 'scenes', 'gameOver.ts'), template)
  }

  private writePluginManager(): void {
    const template = pluginManagerTemplate

    fs.writeFileSync(projectPath('src', 'plugins', 'index.ts'), template)
  }
}
