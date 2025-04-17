import {Args, Command, Flags} from '@oclif/core'
import {camelCase, pascalCase} from 'change-case'
import fs from 'node:fs'

import Template from '../template.js'
import entityTemplate from '../templates/entity.js'
import {checkFolderStructure, projectPath} from '../utils.js'

export default class Entity extends Command {
  static override args = {
    name: Args.string({description: 'name of entity', required: true}),
  }

  static override description = 'Adds a new entity to project'

  static override examples = ['<%= config.bin %> <%= command.id %> player']

  static override flags = {
    dir: Flags.string({char: 'd', default: 'entities', description: 'directory to create the entity in'}),
    subDir: Flags.string({char: 's', default: '', description: 'subdirectory to create the entity in'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Entity)

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
    const template = tpl.render(entityTemplate, {
      camelCaseName: camelCase(name),
      name,
      pascalCaseName: pascalCase(name),
    })

    fs.writeFileSync(componentPath, template)

    this.log(`Entity ${name} created at ${componentPath}`)
  }
}
