// The following is from https://jsr.io/@deno-library/template/0.2.1/mod.ts
/**
MIT License

Copyright (c) 2020 Deno Library

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import fs from 'node:fs/promises'

/**
 * Type alias for data objects where keys are strings and values can be of any type.
 */
export type TemplateData = Record<string, unknown>

/**
 * Interface for constructor options, allowing customization of template delimiters and escape behavior.
 */
export interface ConstructorOptions {
  /**
   * The closing delimiter for template tags. Defaults to "}}".
   */
  close?: string
  /**
   * Whether to escape output for HTML entities. Defaults to true.
   */
  isEscape?: boolean
  /**
   * The opening delimiter for template tags. Defaults to "{{".
   */
  open?: string
}

/**
 * Interface for the compiled function, which takes a data object and an escape function, and returns a rendered string.
 */
export interface CompiledFunction {
  (data: TemplateData, escape: (str: object | string) => string): string
}

/**
 * Class for parsing and rendering template strings.
 */
export default class Template {
  private open: string
  private close: string
  private cache: Map<string, CompiledFunction> = new Map()
  private decoder = new TextDecoder()
  private isEscape: boolean
  private reg: RegExp

  /**
   * Creates a new Template instance.
   * @param options - Optional constructor options.
   */
  constructor(options?: ConstructorOptions) {
    this.open = options?.open ?? '{{'
    this.close = options?.close ?? '}}'
    this.isEscape = options?.isEscape ?? true
    this.reg = new RegExp(`${this.open}([\\s\\S]+?)${this.close}`, 'g')
  }

  /**
   * Renders a given template string.
   * @param str - The template string to render.
   * @param data - The data object used to populate the template.
   * @returns The rendered string.
   */
  render(str: string, data: TemplateData): string {
    return str.replace(this.reg, (match, key: string): string => {
      let value: unknown = data
      for (const k of key.replaceAll(' ', '').split('.')) {
        value = (value as Record<string, unknown>)[k]
      }

      if (value === undefined) return match
      return this.escape(value as TemplateData | string)
    })
  }

  /**
   * Compiles a template string into an executable function.
   * @param str - The template string to compile.
   * @returns The compiled function.
   */
  compile(str: string): CompiledFunction {
    const result = str.replaceAll('\n', '\\n').replace(this.reg, (match, key: string): string => {
      key = key.trim()
      return `' + (obj.${key} ? escape(obj.${key}) : '${match}') + '`
    })
    const tpl = `let tpl = '${result}'\n return tpl;`
    // eslint-disable-next-line no-new-func
    return new Function('obj', 'escape', tpl) as CompiledFunction
  }

  /**
   * Renders data using a compiled function.
   * @param compiled - The compiled function.
   * @param data - The data object used to populate the template.
   * @returns The rendered string.
   */
  renderCompiled(compiled: CompiledFunction, data: TemplateData): string {
    return compiled(data, this.escape.bind(this))
  }

  /**
   * Reads a template from a file and renders it.
   * @param path - The path to the template file.
   * @param data - The data object used to populate the template.
   * @returns The rendered string.
   */
  async renderFile(path: string, data: TemplateData): Promise<string> {
    if (this.cache.has(path)) {
      return this.renderCompiled(this.cache.get(path)!, data)
    }

    const buf = await fs.readFile(path)
    const str = this.decoder.decode(buf)
    const compiled = this.compile(str)
    this.cache.set(path, compiled)
    return compiled(data, this.escape.bind(this))
  }

  /**
   * Escapes a string for HTML entities.
   * @param str - The string or object to escape.
   * @returns The escaped string.
   */
  private escape(str: object | string): string {
    if (typeof str === 'object') {
      str = JSON.stringify(str)
    }

    str = String(str)
    if (this.isEscape === false) return str
    return str
      .replaceAll(/&(?!\w+;)/g, '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }
}
