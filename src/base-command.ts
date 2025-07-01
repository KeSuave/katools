import {Command, Flags, Interfaces} from '@oclif/core'
import {camelCase, pascalCase} from 'change-case'
import {projectPath, templatesPath, writeCodeFile} from './utils.js'

import Template from './thirdparty/template.js'
import fs from 'node:fs'
import {transpileFile} from 'ts-to-jsdoc'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>

export abstract class BaseCommand extends Command {
  static baseFlags = {
    javascript: Flags.boolean({
      char: 'j',
      default: false,
      description: 'uses JavaScript instead of TypeScript',
    }),
  }

  protected abstract type: string

  protected writeFile(
    name: string,
    fileName: string,
    dst: string | string[],
    templateFile: string | string[],
    js: boolean,
  ): void {
    const file = projectPath('src', ...this.toStringArray(dst), `${fileName}.ts`)
    const tpl = new Template({
      close: '%>',
      open: '<%',
    })
    const templateContent = fs.readFileSync(templatesPath(...this.toStringArray(templateFile)), 'utf8')

    let content = tpl.render(templateContent, {
      camelCaseName: camelCase(name),
      name,
      pascalCaseName: pascalCase(name),
    })

    if (js) {
      content = transpileFile({code: content})
    }

    writeCodeFile(file, content, js)

    this.log(`${this.type} ${name} created at '${file}'`)
  }

  protected toStringArray(param: string | string[]): string[] {
    return Array.isArray(param) ? param : [param]
  }
}
