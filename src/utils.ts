import {fileURLToPath} from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import {transpileFile} from 'ts-to-jsdoc'

export function projectPath(...p: string[]): string {
  return path.join(process.cwd(), ...p)
}

export function templatesPath(...p: string[]): string {
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)

  return path.join(dirname, '..', 'templates', ...p)
}

export function writeCodeFile(file: string, code: string, js: boolean): void {
  if (js) {
    fs.writeFileSync(file.replace('.ts', '.js'), transpileFile({code}), 'utf8')

    return
  }

  fs.writeFileSync(file, code, 'utf8')
}
