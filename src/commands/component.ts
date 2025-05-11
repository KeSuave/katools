import {Args, Command, Flags} from '@oclif/core'
import {camelCase, pascalCase} from 'change-case'

import componentTemplate from '../templates/component.js'
import Template from '../thirdparty/template.js'
import {checkFolderStructure, projectPath, writeCodeFile} from '../utils.js'

export default class Component extends Command {
  static override args = {
    name: Args.string({description: 'name of component', required: true}),
  }

  static override description = 'Adds a new component to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> movement']

  static override flags = {
    dir: Flags.string({char: 'd', default: 'components', description: 'directory to create the component in'}),
    subDir: Flags.string({char: 's', default: '', description: 'subdirectory to create the component in'}),
    javascript: Flags.boolean({
      char: 'j',
      default: false,
      description: 'uses JavaScript instead of TypeScript',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Component)

    let {dir, subDir, javascript} = flags

    if (subDir) {
      dir = `${dir}/${subDir}`
    }

    if (!checkFolderStructure(dir)) {
      this.error('The current directory does not contain a src folder.')
    }

    this.writeNewComponent(args.name, dir, javascript)
  }

  private writeNewComponent(name: string, dir: string, js: boolean): void {
    const componentPath = projectPath('src', dir, `${name}.ts`)
    const tpl = new Template({
      close: '%>',
      open: '<%',
    })
    const template = tpl.render(componentTemplate, {
      camelCaseName: camelCase(name),
      name,
      pascalCaseName: pascalCase(name),
    })

    writeCodeFile(componentPath, template, js)

    this.log(`Component ${name} created at ${componentPath}`)
  }
}
