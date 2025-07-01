import {Args, Flags} from '@oclif/core'

import fs from 'node:fs'
import {BaseCommand} from '../base-command.js'
import {projectPath} from '../utils.js'

export default class Component extends BaseCommand {
  static override args = {
    name: Args.string({description: 'name of component', required: true}),
  }

  static override description = 'Adds a new component to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> movement']

  static override flags = {
    dir: Flags.string({char: 'd', default: 'components', description: 'directory to create the component in'}),
    subDir: Flags.string({char: 's', default: '', description: 'subdirectory to create the component in'}),
  }

  protected type = 'Component'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Component)
    const {dir, subDir, javascript} = flags
    const dirPath = [dir]

    if (subDir) {
      dirPath.push(subDir)
    }

    this.checkFolderStructure(dirPath)

    this.writeFile(args.name, args.name, dir, ['components', 'component.ts.template'], javascript)
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
