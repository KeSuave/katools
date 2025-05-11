import fs from 'node:fs'
import path from 'node:path'
import {transpileFile} from 'ts-to-jsdoc'

export function projectPath(...p: string[]): string {
  return path.join(process.cwd(), ...p)
}

export function checkFolderStructure(dir: string): boolean {
  if (!fs.existsSync(projectPath('src'))) {
    return false
  }

  if (!fs.existsSync(projectPath('src', dir))) {
    fs.mkdirSync(projectPath('src', dir), {recursive: true})
  }

  return true
}

export function writeCodeFile(file: string, code: string, js: boolean): void {
  if (js) {
    fs.writeFileSync(file.replace('.ts', '.js'), transpileFile({code}), 'utf8')
  }

  if (!js) {
    fs.writeFileSync(file, code, 'utf8')
  }
}
