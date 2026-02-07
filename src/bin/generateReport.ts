#!/usr/bin/env node
import { createError } from '../utils'
import { stringify } from 'csv-stringify/sync'
import { Float } from '../types'
import { CsvFileStreamReader, Reader } from '../services/readers'
import { ConsoleWriter, FileBatchWriter, FileStreamWriter, Writer } from '../services'
import { HandlerFactory } from '../handlers'

/**
 * Job
 */
export const generateReport = async (inputFileName: string | null): Promise<object> => {
    let generator: {
        success: boolean
        error: Error | null
        duration: number
        input: string | null
        output: string | null
        metrics: unknown
    } = {
        success: false,
        error: null,
        duration: performance.now(),
        input: inputFileName,
        output: null,
        metrics: null,
    }

    try {
        // Verify source file
        if (!inputFileName) {
            throw new Error(`filename not provided`)
        }

        // Create the report handler
        const handler = HandlerFactory.new(inputFileName)
        console.log(handler)

        // Prepare the reader
        const reader: Reader = new CsvFileStreamReader(inputFileName)
        await reader.open()

        // Set output file
        const outputFilePath = `generated/${handler.getOutputFileName()}` //path.basename(outputFileName)
        generator.output = outputFilePath

        // Prepare the writer
        //const reportWriter: Writer = new ConsoleWriter()
        const writer: Writer = new FileStreamWriter(outputFilePath)
        await writer.open()

        // Write columns
        await writer.write(stringify([], { header: true, columns: handler.getColumns() }).trim())

        // Process mapped lines and write
        for await (const row of handler.processor.process(handler.map(await reader.read()))) {
            await writer.write(
                stringify([row], {
                    header: false,
                    columns: handler.getColumns(),
                    cast: {
                        object: (value: unknown) => (value as unknown as Float).toFixed(8),
                        date: (value: Date) => value.toISOString().slice(0, 23),
                    },
                }).trim()
            )
        }

        // Close the reader & writer
        await reader.close()
        await writer.close()

        generator.success = true
        generator.metrics = handler.processor.metrics()
    } catch (e: unknown) {
        const error: Error = createError(e)
        generator.error = error
    } finally {
        generator.duration = performance.now() - generator.duration
    }

    return generator
}

/**
 * Bootstrap
 */
/* istanbul ignore next */
if (require.main === module) {
    ;(async () => {
        const [, , inputFileName] = process.argv
        const generator: any = await generateReport(inputFileName)

        if (generator.success) {
            console.log(`OK (${Number(generator.duration.toFixed(0)).toLocaleString()} ms): `)
            console.log(`    ${generator.input} (${generator?.metrics?.rowsIn.toLocaleString()} rows) `)
            console.log(`    --> ${generator.output} (${generator.metrics.rowsOut.toLocaleString()} rows)`)

            process.exit(0)
        } else {
            console.error('ERROR ', generator.error.name, generator.error.message)
            process.exit(1)
        }
    })()
}
