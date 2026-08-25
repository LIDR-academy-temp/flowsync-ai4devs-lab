import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import {
  buildOpenapiDocument,
  diffOpenapiDocuments,
  openapiDocumentPath,
  serializeOpenapiDocument,
  type OpenapiDifference,
} from '#services/openapi_document'

/**
 * Cuántas diferencias se enumeran antes de resumir el resto. El total siempre se
 * dice, para que un recorte no se lea como «no había más».
 */
const MAX_LISTED_DIFFERENCES = 40

/**
 * Comprueba que el documento versionado sigue siendo el que produce el router.
 *
 * Solo compara: regenera en un directorio temporal y no escribe nunca sobre
 * `docs/api/openapi.json`. Si no coinciden, enumera las diferencias y termina
 * con código 1; arreglarlo es cosa de `openapi:generate`.
 */
export default class OpenapiCheck extends BaseCommand {
  static commandName = 'openapi:check'
  static description =
    'Comprueba que docs/api/openapi.json coincide con el documento que genera el router. No lo reescribe.'

  static options: CommandOptions = { startApp: true }

  async run() {
    const documentPath = openapiDocumentPath(this.app)

    const temporaryDirectory = await mkdtemp(join(tmpdir(), 'flowsync-openapi-'))
    const regeneratedPath = join(temporaryDirectory, 'openapi.json')
    const regenerated = serializeOpenapiDocument(await buildOpenapiDocument(this.app))
    await writeFile(regeneratedPath, regenerated, 'utf-8')

    const versioned = await readFile(documentPath, 'utf-8').catch(() => null)

    if (versioned === null) {
      this.#fail(
        `falta ${this.#display(documentPath)}`,
        [`No existe ${this.#display(documentPath)}: nadie lo ha generado todavía.`],
        regeneratedPath,
        documentPath
      )
      return
    }

    if (versioned === regenerated) {
      await rm(temporaryDirectory, { recursive: true, force: true })
      this.logger.success(`${this.#display(documentPath)} está al día`)
      return
    }

    // El directorio temporal se queda a propósito cuando hay diferencias: es lo
    // que permite verlas con un `diff` de verdad.
    this.#fail(
      `${this.#display(documentPath)} no coincide con el documento del router`,
      this.#explain(versioned, regenerated),
      regeneratedPath,
      documentPath
    )
  }

  /**
   * Traduce la diferencia a algo accionable. El caso interesante no es «los
   * ficheros difieren» sino qué parte del contrato se ha quedado atrás.
   */
  #explain(versioned: string, regenerated: string) {
    let differences: OpenapiDifference[]

    try {
      differences = diffOpenapiDocuments(JSON.parse(versioned), JSON.parse(regenerated))
    } catch {
      return [
        'El fichero versionado no es JSON válido, así que no se puede comparar campo a campo.',
      ]
    }

    if (differences.length === 0) {
      return [
        'El contenido es el mismo pero el fichero no está serializado como lo escribe',
        '`openapi:generate` (sangría de dos espacios, salto de línea final y orden de claves).',
      ]
    }

    const lines = [
      `El documento versionado se ha quedado atrás. ${differences.length} ${
        differences.length === 1 ? 'diferencia' : 'diferencias'
      }:`,
      '',
    ]

    for (const difference of differences.slice(0, MAX_LISTED_DIFFERENCES)) {
      lines.push(...this.#describe(difference))
    }

    if (differences.length > MAX_LISTED_DIFFERENCES) {
      lines.push(`  … y ${differences.length - MAX_LISTED_DIFFERENCES} diferencias más.`)
    }

    return lines
  }

  #describe(difference: OpenapiDifference) {
    switch (difference.kind) {
      case 'missing':
        return [
          `  ${difference.path} — falta en el fichero versionado`,
          `      generado: ${this.#preview(difference.regenerated)}`,
        ]
      case 'extra':
        return [
          `  ${difference.path} — ya no lo genera el router`,
          `      versionado: ${this.#preview(difference.versioned)}`,
        ]
      case 'changed':
        return [
          `  ${difference.path}`,
          `      versionado: ${this.#preview(difference.versioned)}`,
          `      generado:   ${this.#preview(difference.regenerated)}`,
        ]
    }
  }

  #preview(value: unknown) {
    const text = JSON.stringify(value) ?? String(value)
    return text.length > 120 ? `${text.slice(0, 117)}…` : text
  }

  #fail(summary: string, lines: string[], regeneratedPath: string, documentPath: string) {
    for (const line of lines) {
      this.logger.log(line)
    }

    this.logger.log('')
    this.logger.log('El documento regenerado se queda en el directorio temporal, para poder verlo:')
    this.logger.log(`  diff ${this.#display(documentPath)} ${regeneratedPath}`)
    this.logger.log('Para ponerlo al día: npm run openapi:generate')
    this.logger.error(summary)

    this.exitCode = 1
  }

  #display(path: string) {
    return relative(process.cwd(), path)
  }
}
