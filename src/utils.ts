import path from 'node:path'

export function projectPath(...p: string[]): string {
  return path.join(process.cwd(), ...p)
}
