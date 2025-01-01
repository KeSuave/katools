import {Args, Command} from '@oclif/core'
import {camelCase, pascalCase} from 'change-case'
import fs from 'node:fs'
import Template from '../template.js'
import basePluginTemplate from '../templates/plugins/base.js'
import {projectPath} from '../utils.js'

export default class Plugin extends Command {
  static override args = {
    name: Args.string({description: 'name of plugin', required: true}),
  }

  static override description = 'adds a new plugin to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> score']

  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(Plugin)

    this.checkFolderStructure()

    this.writeNewPlugin(args.name)
    this.addPluginToManager(args.name)
  }

  private checkFolderStructure(): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'plugins'))) {
      this.error('The current directory does not contain a src/plugins folder.')
    }

    if (!fs.existsSync(projectPath('src', 'plugins', 'index.ts'))) {
      this.error('The current directory does not contain a src/plugins/index.ts file.')
    }
  }

  private writeNewPlugin(name: string): void {
    const tpl = new Template({
      close: '%>',
      open: '<%',
    })
    const template = tpl.render(basePluginTemplate, {
      camelCaseName: camelCase(name),
      name,
      pascalCaseName: pascalCase(name),
    })

    fs.writeFileSync(projectPath('src', 'plugins', `${name}.ts`), template)

    this.log(`Created new plugin: ${name}`)
  }

  private addPluginToManager(name: string): void {
    const filePath = projectPath('src', 'plugins', 'index.ts')
    const importLine = `import { ${name}Plugin } from './${name}';\n`
    const pluginLine = `  ${name}Plugin),\n`

    const data = fs.readFileSync(filePath, 'utf8')

    let updatedData = ''

    if (data.includes('import')) {
      updatedData = data.replaceAll(/(import\s+[\S\s]*?\n)+/gm, (imports) => {
        if (imports.includes(importLine)) {
          this.error(`The plugin ${name} is already imported in src/plugins/index.ts.`)
        }

        return `${imports}${importLine}`
      })
    } else {
      updatedData += importLine
      updatedData += data
    }

    updatedData = updatedData.replace(/export\s+default\s*\[([\S\s]*?)]/, (_match, plugins) => {
      if (plugins.includes(pluginLine)) {
        this.error(`The plugin ${name} is already exported in src/plugins/index.ts.`)
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

    fs.writeFileSync(filePath, updatedData, 'utf8')

    this.log(`Plugin "${name}" has been added to src/plugins/index.ts`)
  }
}
