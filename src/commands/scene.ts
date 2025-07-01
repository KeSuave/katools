import {Args} from '@oclif/core'
import fs from 'node:fs'

import {BaseCommand} from '../base-command.js'
import {projectPath, writeCodeFile} from '../utils.js'

export default class Scene extends BaseCommand {
  static override args = {
    name: Args.string({description: 'name of scene', required: true}),
  }

  static override description = 'adds a scene to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> game']

  static override flags = {}

  protected type = 'Scene'

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Scene)

    this.checkFolderStructure(flags.javascript)

    this.writeFile(args.name, args.name, ['scenes'], ['scenes', 'base.ts.template'], flags.javascript)
    this.addSceneToManager(args.name, flags.javascript)
  }

  private checkFolderStructure(js: boolean): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'scenes'))) {
      this.error('The current directory does not contain a src/scenes folder')
    }

    const file = projectPath('src', 'scenes', js ? 'index.js' : 'index.ts')

    if (!fs.existsSync(file)) {
      this.error(`The current directory does not contain a ${file} file`)
    }
  }

  private addSceneToManager(name: string, js: boolean): void {
    const file = projectPath('src', 'scenes', js ? 'index.js' : 'index.ts')
    const importLine = `import { ${name}Scene } from './${name}';\n`
    const sceneLine = `  k.scene('${name}', ${name}Scene);\n`

    const data = fs.readFileSync(file, 'utf8')

    let updatedData = ''

    if (data.includes('import')) {
      updatedData = data.replaceAll(/(import\s+[\S\s]*?\n)+/gm, (imports) => {
        if (imports.includes(importLine)) {
          this.error(`The scene ${name} is already imported in ${file}.`)
        }

        return `${imports}${importLine}`
      })
    } else {
      updatedData += importLine
      updatedData += data
    }

    updatedData = updatedData.replace(
      /(export\s+default\s+function\s+addScenes\(\)(?:: void)?\s*{)([\S\s]*?)}/,
      (_match, fn, scenes) => {
        if (scenes.includes(sceneLine)) {
          this.error(`The scene ${name} is already exported in ${file}.`)
        }

        return `${fn}${scenes}${sceneLine}}`
      },
    )

    writeCodeFile(file, updatedData, js)

    this.log(`Scene "${name}" has been added to ${file}`)
  }
}
