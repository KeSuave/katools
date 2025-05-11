import {Args, Command, Flags} from '@oclif/core'
import {camelCase, pascalCase} from 'change-case'

import entityTemplate from '../templates/entity.js'
import Template from '../thirdparty/template.js'
import {checkFolderStructure, projectPath, writeCodeFile} from '../utils.js'

export default class Entity extends Command {
  static override args = {
    name: Args.string({description: 'name of entity', required: true}),
  }

  static override description = 'Adds a new entity to project'

  static override examples = ['<%= config.bin %> <%= command.id %> player']

  static override flags = {
    dir: Flags.string({char: 'd', default: 'entities', description: 'directory to create the entity in'}),
    subDir: Flags.string({char: 's', default: '', description: 'subdirectory to create the entity in'}),
    javascript: Flags.boolean({
      char: 'j',
      default: false,
      description: 'uses JavaScript instead of TypeScript',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Entity)

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
    const template = tpl.render(entityTemplate, {
      camelCaseName: camelCase(name),
      name,
      pascalCaseName: pascalCase(name),
    })

    writeCodeFile(componentPath, template, js)

    this.log(`Entity ${name} created at ${componentPath}`)
  }
}
