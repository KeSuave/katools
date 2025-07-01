import {Args} from '@oclif/core'
import fs from 'node:fs'
import {BaseCommand} from '../base-command.js'
import {projectPath, writeCodeFile} from '../utils.js'

export default class Plugin extends BaseCommand {
  static override args = {
    name: Args.string({description: 'name of plugin', required: true}),
  }

  static override description = 'adds a new plugin to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> score']

  static override flags = {}

  protected type = 'Plugin'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Plugin)

    this.checkFolderStructure(args.name, flags.javascript)

    this.writeNewPlugin(args.name, flags.javascript)
    this.addPluginToManager(args.name, flags.javascript)
  }

  private checkFolderStructure(name: string, js: boolean): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'plugins'))) {
      this.error('The current directory does not contain a src/plugins folder.')
    }

    if (fs.existsSync(projectPath('src', 'plugins', name))) {
      this.error('A plugin with the same name already exists.')
    }

    const file = projectPath('src', 'plugins', js ? 'index.js' : 'index.ts')

    if (!fs.existsSync(file)) {
      this.error(`The current directory does not contain a ${file} file.`)
    }
  }

  private writeNewPlugin(name: string, js: boolean): void {
    fs.mkdirSync(projectPath('src', 'plugins', name))

    this.writeFile(name, 'index', ['plugins', name], ['plugins', 'index.ts.template'], js)
    this.writeFile(name, name, ['plugins', name], ['plugins', 'base.ts.template'], js)
  }

  private addPluginToManager(name: string, js: boolean): void {
    const file = projectPath('src', 'plugins', js ? 'index.js' : 'index.ts')
    const importLine = `import ${name}Plugin from './${name}';\n`
    const pluginLine = `  ${name}Plugin),\n`

    const data = fs.readFileSync(file, 'utf8')

    let updatedData = ''

    if (data.includes('import')) {
      updatedData = data.replaceAll(/(import\s+[\S\s]*?\n)+/gm, (imports) => {
        if (imports.includes(importLine)) {
          this.error(`The plugin ${name} is already imported in ${file}.`)
        }

        return `${imports}${importLine}`
      })
    } else {
      updatedData += importLine
      updatedData += data
    }

    updatedData = updatedData.replace(/export\s+default\s*\[([\S\s]*?)]/, (_match, plugins) => {
      if (plugins.includes(pluginLine)) {
        this.error(`The plugin ${name} is already exported in ${file}.`)
      }

      const items = plugins.split(',').map((item: string) => item.trim())

      if (items.at(-1) === '') {
        items.pop()
      }

      let updatedArray = ''

      if (items.length > 0 && items[0].length > 0) {
        updatedArray += `  ${items.join(',\n  ')},\n`
      }

      updatedArray += `  ${name}Plugin,\n`

      return `export default [\n${updatedArray}]`
    })

    writeCodeFile(file, updatedData, js)

    this.log(`Plugin ${name} has been added to ${file}`)
  }
}
