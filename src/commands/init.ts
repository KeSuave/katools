import Template from '@deno-library/template'
import {Command, Flags} from '@oclif/core'
import fs from 'node:fs'
import path from 'node:path'

import bootSceneTemplate from '../templates/scenes/boot.js'
import gameSceneTemplate from '../templates/scenes/game.js'
import gameOverSceneTemplate from '../templates/scenes/game-over.js'
import sceneManagerTemplate from '../templates/scenes/manager.js'
import menuSceneTemplate from '../templates/scenes/menu.js'
import {projectPath} from '../utils.js'

export default class Init extends Command {
  static override description = 'Initializes a new KAPLAY project.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    name: Flags.string({char: 'n', default: path.basename(process.cwd()), description: 'name of your game.'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Init)
    const gameName = flags.name

    this.checkFolderStructure()
    this.writeSceneManager()
    this.writeBootScene()
    this.writeMenuScene(gameName)
    this.writeGameScene()
    this.writeGameOverScene()

    this.log('Done!')
  }

  private checkFolderStructure(): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'scenes'))) {
      fs.mkdirSync(projectPath('src', 'scenes'))
    }
  }

  private writeSceneManager(): void {
    const template = sceneManagerTemplate

    fs.writeFileSync(projectPath('src', 'scenes', 'index.ts'), template)

    this.log('Wrote scene manager file')
  }

  private writeBootScene(): void {
    const template = bootSceneTemplate

    fs.writeFileSync(projectPath('src', 'scenes', 'boot.ts'), template)
  }

  private writeMenuScene(gameName: string): void {
    const tpl = new Template({
      close: '%>',
      open: '<%',
    })
    const template = tpl.render(menuSceneTemplate, {gameName})

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
}
