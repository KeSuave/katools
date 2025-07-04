import {Args, Flags} from '@oclif/core'
import fs from 'node:fs'
import {table} from 'table'
import {BaseCommand} from '../base-command.js'
import {entitiesList} from '../prebuilt/entities.js'
import {pluginList} from '../prebuilt/plugins.js'
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
        ...Object.values(entitiesList).map((value) => [value.name, 'Entity', value.desc]),
        ...Object.values(pluginList).map((value) => [value.name, 'Plugin', value.desc]),
      ]),
    )
  }

  private addPrebuilt(type: string, name: string, js: boolean): void {
    if (type === 'component') {
      this.error('No components available yet.')
    }

    if (type === 'entity') {
      if (name.toLocaleLowerCase() in entitiesList) {
        const entity = entitiesList[name.toLocaleLowerCase()]

        this.checkEntities()

        this.writeTemplatedFile(entity.name, entity.name, ['entities'], ['entities', `${name}.ts`], js)

        return
      }

      this.error(`No entity named ${name} found.`)
    }

    if (type === 'plugin') {
      if (name.toLocaleLowerCase() in pluginList) {
        const plugin = pluginList[name.toLocaleLowerCase()]

        this.checkPlugins(plugin.name)

        this.writeTemplatedFolder(plugin.name, ['plugins', plugin.name], ['plugins', plugin.name], js)

        Plugin.addPluginToManager(this, plugin.name, js)

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

  private writeTemplatedFolder(name: string, dst: string[], templateFolder: string[], js: boolean): void {
    const templates = fs.readdirSync(templatesPath(...templateFolder))

    for (const template of templates) {
      if (fs.lstatSync(templatesPath(...templateFolder, template)).isDirectory()) {
        fs.mkdirSync(projectPath('src', ...dst, template))

        this.writeTemplatedFolder(name, [...dst, template], [...templateFolder, template], js)

        continue
      }

      const fileName = template.slice(0, -3)

      this.writeTemplatedFile(name, fileName, dst, [...templateFolder, template], js)
    }
  }
}
