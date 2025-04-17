import {Args, Command, Flags} from '@oclif/core'
import {camelCase, pascalCase} from 'change-case'
import fs from 'node:fs'

import Template from '../template.js'
import componentTemplate from '../templates/component.js'
import {checkFolderStructure, projectPath} from '../utils.js'

export default class Component extends Command {
  static override args = {
    name: Args.string({description: 'name of component', required: true}),
  }

  static override description = 'Adds a new component to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> movement']

  static override flags = {
    dir: Flags.string({char: 'd', default: 'components', description: 'directory to create the component in'}),
    subDir: Flags.string({char: 's', default: '', description: 'subdirectory to create the component in'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Component)

    let {dir, subDir} = flags

    if (subDir) {
      dir = `${dir}/${subDir}`
    }

    if (!checkFolderStructure(dir)) {
      this.error('The current directory does not contain a src folder.')
    }

    this.writeNewComponent(args.name, dir)
  }

  private writeNewComponent(name: string, dir: string): void {
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

    fs.writeFileSync(componentPath, template)

    this.log(`Component ${name} created at ${componentPath}`)
  }
}
