import {Flags} from '@oclif/core'
import fs from 'node:fs'
import path from 'node:path'

import {confirm, input, number} from '@inquirer/prompts'
import {transpileFile} from 'ts-to-jsdoc'
import {BaseCommand} from '../base-command.js'
import Template from '../thirdparty/template.js'
import {projectPath, templatesPath, writeCodeFile} from '../utils.js'

interface GameContextOptions {
  width: number
  height: number
  letterbox: boolean
  debugKey: string
}

export default class Init extends BaseCommand {
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

  protected type = 'Initialization'

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
    const templateContent = fs.readFileSync(templatesPath('context.ts.template'), 'utf8')
    let content = this.tpl.render(templateContent, {
      width: options.width,
      height: options.height,
      letterbox: options.letterbox ? 'true' : 'false',
      debugKey: options.debugKey,
    })

    if (js) {
      content = transpileFile({code: content})
    }

    writeCodeFile(projectPath('src', 'context.ts'), content, js)
  }

  private writeSceneManager(js: boolean): void {
    this.writeFile('Game Manager', 'index', 'scenes', ['scenes', 'manager.ts.template'], js)
  }

  private writeBootScene(js: boolean): void {
    this.writeFile('Boot Scene', 'boot', 'scenes', ['scenes', 'boot.ts.template'], js)
  }

  private writeMenuScene(gameName: string, js: boolean): void {
    this.writeFile('Menu Scene', 'menu', 'scenes', ['scenes', 'menu.ts.template'], js)
  }

  private writeGameScene(js: boolean): void {
    this.writeFile('Game Scene', 'game', 'scenes', ['scenes', 'game.ts.template'], js)
  }

  private writeGameOverScene(js: boolean): void {
    this.writeFile('Game Over Scene', 'gameOver', 'scenes', ['scenes', 'game-over.ts.template'], js)
  }

  private writePluginManager(js: boolean): void {
    this.writeFile('Plugin Manager', 'index', 'plugins', ['plugins', 'manager.ts.template'], js)
  }
}
