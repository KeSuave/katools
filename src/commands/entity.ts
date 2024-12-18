import {Args, Command} from '@oclif/core'
import fs from 'node:fs'

import entityTemplate from '../templates/entity.js'
import {projectPath} from '../utils.js'

export default class Entity extends Command {
  static override args = {
    name: Args.string({description: 'name of entity', required: true}),
  }

  static override description = 'Adds a new entity to project'

  static override examples = ['<%= config.bin %> <%= command.id %> player']

  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(Entity)

    this.checkFolderStructure()

    this.writeNewComponent(args.name)
  }

  private checkFolderStructure(): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'entities'))) {
      fs.mkdirSync(projectPath('src', 'entities'))
    }
  }

  private writeNewComponent(name: string): void {
    const componentPath = projectPath('src', 'entities', `${name}.ts`)
    const template = entityTemplate

    fs.writeFileSync(componentPath, template)

    this.log(`Entity ${name} created at ${componentPath}`)
  }
}
