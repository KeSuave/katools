import {Args, Command, Flags} from '@oclif/core'
import fs from 'node:fs'

import baseSceneTemplate from '../templates/scenes/base.js'
import Template from '../thirdparty/template.js'
import {projectPath, writeCodeFile} from '../utils.js'

export default class Scene extends Command {
  static override args = {
    name: Args.string({description: 'name of scene', required: true}),
  }

  static override description = 'adds a scene to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> game']

  static override flags = {
    javascript: Flags.boolean({
      char: 'j',
      default: false,
      description: 'uses JavaScript instead of TypeScript',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Scene)

    this.checkFolderStructure(flags.javascript)

    this.writeNewScene(args.name, flags.javascript)
    this.addSceneToManager(args.name, flags.javascript)
  }

  private checkFolderStructure(js: boolean): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'scenes'))) {
      this.error('The current directory does not contain a scr/scenes folder')
    }

    const file = projectPath('src', 'scenes', js ? 'index.js' : 'index.ts')

    if (!fs.existsSync(file)) {
      this.error(`The current directory does not contain a ${file} file`)
    }
  }

  private writeNewScene(name: string, js: boolean): void {
    const tpl = new Template({
      close: '%>',
      open: '<%',
    })
    const template = tpl.render(baseSceneTemplate, {name})
    const scenePath = projectPath('src', 'scenes', `${name}.ts`)

    writeCodeFile(scenePath, template, js)

    this.log(`Scene ${name} created at ${scenePath}`)
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
