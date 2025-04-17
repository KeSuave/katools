import fs from 'node:fs'
import path from 'node:path'

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
