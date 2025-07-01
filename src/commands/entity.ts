import {Args, Flags} from '@oclif/core'

import fs from 'node:fs'
import {BaseCommand} from '../base-command.js'
import {projectPath} from '../utils.js'

export default class Entity extends BaseCommand {
  static override args = {
    name: Args.string({description: 'name of entity', required: true}),
  }

  static override description = 'Adds a new entity to project'

  static override examples = ['<%= config.bin %> <%= command.id %> player']

  static override flags = {
    dir: Flags.string({char: 'd', default: 'entities', description: 'directory to create the entity in'}),
    subDir: Flags.string({char: 's', default: '', description: 'subdirectory to create the entity in'}),
  }

  protected type = 'Entity'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Entity)
    const {dir, subDir, javascript} = flags
    const dirPath = [dir]

    if (subDir) {
      dirPath.push(subDir)
    }

    this.checkFolderStructure(dirPath)

    this.writeFile(args.name, args.name, dir, ['entities', 'entity.ts.template'], javascript)
  }

  private checkFolderStructure(dir: string[]): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', ...this.toStringArray(dir)))) {
      fs.mkdirSync(projectPath('src', ...this.toStringArray(dir)), {recursive: true})
    }
  }
}
