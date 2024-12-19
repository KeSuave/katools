import {Args, Command} from '@oclif/core'
import {camelCase, pascalCase} from 'change-case'
import fs from 'node:fs'

import Template from '../template.js'
import componentTemplate from '../templates/component.js'
import {projectPath} from '../utils.js'

export default class Component extends Command {
  static override args = {
    name: Args.string({description: 'name of component', required: true}),
  }

  static override description = 'Adds a new component to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> movement']

  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(Component)

    this.checkFolderStructure()

    this.writeNewComponent(args.name)
  }

  private checkFolderStructure(): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'components'))) {
      fs.mkdirSync(projectPath('src', 'components'))
    }
  }

  private writeNewComponent(name: string): void {
    const componentPath = projectPath('src', 'components', `${name}.ts`)
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
