import {Args, Flags} from '@oclif/core'
import fs from 'node:fs'
import {table} from 'table'
import {BaseCommand} from '../base-command.js'
import {projectPath, templatesPath} from '../utils.js'
import Plugin from './plugin.js'

export default class Prebuilt extends BaseCommand {
  static override args = {
    type: Args.string({
      description: 'type of prebuilt tool.',
      options: ['component', 'entity', 'plugin', 'scene'],
    }),
    name: Args.string({description: 'name of the prebuilt tool.'}),
  }

  static override description = 'Adds a prebuilt tool to the project.'

  static override examples = ['<%= config.bin %> <%= command.id %> topDownMovement']

  static override flags = {
    list: Flags.boolean({char: 'l', description: 'list all available prebuilt tools'}),
  }

  protected type = 'Prebuilt'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Prebuilt)

    if (flags.list) {
      this.showList()

      return
    }

    if (!args.type || !args.name) {
      this.error('Both type and name are required.')
    }

    this.addPrebuilt(args.type, args.name, flags.javascript)
  }

  private showList(): void {
    this.log(
      table([
        ['Name', 'Type', 'Description'],
        [
          'menuItem',
          'Entity',
          'A simple menu item that displays a label, changes color on hover, and triggers an action when clicked.',
        ],
        ['topDownMovement', 'Plugin', 'A plugin for handling top-down movement.'],
        ['levelX', 'Plugin', 'A plugin intending to improve the level and tile components.'],
        ['fps', 'Plugin', 'A plugin to keep track of fps without having to enter debug mode, which adds overhead.'],
      ]),
    )
  }

  private addPrebuilt(type: string, name: string, js: boolean): void {
    if (type === 'component') {
      this.error('No components available yet.')
    }

    if (type === 'entity') {
      if (name.toLowerCase() === 'menuitem') {
        this.checkEntities()

        this.writeTemplatedFile('Menu Item', 'menuItem', ['entities'], ['entities', 'menuItem.ts'], js)

        return
      }

      this.error(`No entity named ${name} found.`)
    }

    if (type === 'plugin') {
      if (name.toLowerCase() === 'topdownmovement') {
        this.checkPlugins('topDownMovement')

        this.writeTemplatedFolder('Top Down Movement', 'topDownMovement', js)

        return
      }

      this.error(`No plugin named ${name} found.`)
    }

    if (type === 'scene') {
      this.error('No scenes available yet.')
    }
  }

  private checkComponents(): void {
    if (!fs.existsSync(projectPath('src', 'components'))) {
      fs.mkdirSync(projectPath('src', 'components'), {recursive: true})
    }
  }

  private checkEntities(): void {
    if (!fs.existsSync(projectPath('src', 'entities'))) {
      fs.mkdirSync(projectPath('src', 'entities'), {recursive: true})
    }
  }

  private checkPlugins(folder: string): void {
    if (!fs.existsSync(projectPath('src', 'plugins'))) {
      this.error('')
    }

    if (fs.existsSync(projectPath('src', 'plugins', folder))) {
      this.error(`Plugin ${folder} already exists.`)
    }

    fs.mkdirSync(projectPath('src', 'plugins', folder))
  }

  private writeTemplatedFolder(name: string, folderName: string, js: boolean): void {
    const files = fs.readdirSync(templatesPath('plugins', folderName))

    for (const file of files) {
      const fileName = file.slice(0, -3)

      this.writeTemplatedFile(name, fileName, ['plugins', folderName], ['plugins', folderName, file], js)
    }

    Plugin.addPluginToManager(this, folderName, js)
  }
}
