import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, relative } from 'node:path'
import {
  buildOpenapiDocument,
  openapiDocumentPath,
  serializeOpenapiDocument,
} from '#services/openapi_document'

/**
 * Escribe en el repositorio el documento OpenAPI que hasta ahora solo existía
 * mientras el servidor corría.
 */
export default class OpenapiGenerate extends BaseCommand {
  static commandName = 'openapi:generate'
  static description =
    'Construye el documento OpenAPI desde el router y lo escribe en docs/api/openapi.json'

  /**
   * Sin la aplicación arrancada no se han cargado los preloads, y sin
   * `#start/routes` no hay rutas que documentar.
   */
  static options: CommandOptions = { startApp: true }

  async run() {
    const documentPath = openapiDocumentPath(this.app)
    const document = serializeOpenapiDocument(await buildOpenapiDocument(this.app))

    await mkdir(dirname(documentPath), { recursive: true })
    await writeFile(documentPath, document, 'utf-8')

    this.logger.success(`documento escrito en ${relative(process.cwd(), documentPath)}`)
  }
}
