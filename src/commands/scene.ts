import {Args, Command} from '@oclif/core'
import fs from 'node:fs'

import Template from '../template.js'
import baseSceneTemplate from '../templates/scenes/base.js'
import {projectPath} from '../utils.js'

export default class Scene extends Command {
  static override args = {
    name: Args.string({description: 'name of scene', required: true}),
  }

  static override description = 'adds a scene to the project'

  static override examples = ['<%= config.bin %> <%= command.id %> game']

  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(Scene)

    this.checkFolderStructure()

    this.writeNewScene(args.name)
    this.addSceneToManager(args.name)
  }

  private checkFolderStructure(): void {
    if (!fs.existsSync(projectPath('src'))) {
      this.error('The current directory does not contain a src folder.')
    }

    if (!fs.existsSync(projectPath('src', 'scenes'))) {
      this.error('The current directory does not contain a scr/scenes folder')
    }

    if (!fs.existsSync(projectPath('src', 'scenes', 'index.ts'))) {
      this.error('The current directory does not contain a src/scenes/index.ts file')
    }
  }

  private writeNewScene(name: string): void {
    const tpl = new Template({
      close: '%>',
      open: '<%',
    })
    const template = tpl.render(baseSceneTemplate, {name})

    fs.writeFileSync(projectPath('src', 'scenes', `${name}.ts`), template)

    this.log(`Created new scene: ${name}`)
  }

  private addSceneToManager(name: string): void {
    const filePath = projectPath('src', 'scenes', 'index.ts')
    const importLine = `import { ${name}Scene } from './${name}';\n`
    const sceneLine = `  k.scene('${name}', ${name}Scene);\n`

    const data = fs.readFileSync(filePath, 'utf8')

    let updatedData = ''

    if (data.includes('import')) {
      updatedData = data.replaceAll(/(import\s+[\S\s]*?\n)+/gm, (imports) => {
        if (imports.includes(importLine)) {
          this.error(`The scene ${name} is already imported in src/scenes/index.ts.`)
        }

        return `${imports}${importLine}`
      })
    } else {
      updatedData += importLine
      updatedData += data
    }

    updatedData = updatedData.replace(
      /(export\s+default\s+function\s+addScenes\(k: KAPLAYCtx\): void\s*{)([\S\s]*?)}/,
      (_match, fn, scenes) => {
        if (scenes.includes(sceneLine)) {
          this.error(`The scene ${name} is already exported in src/scenes/index.ts.`)
        }

        // updatedData = `${match}\n  k.scene("${name}", ${name}Scene);\n}\n`

        return `${fn}${scenes}  k.scene("${name}", ${name}Scene);\n}`
      },
    )

    fs.writeFileSync(filePath, updatedData, 'utf8')

    this.log(`Scene "${name}" has been added to src/scenes/index.ts`)
  }
}
