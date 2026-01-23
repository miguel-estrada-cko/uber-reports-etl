#!/usr/bin/env node
import fs, { ReadStream } from 'fs'
import path from 'path'
import { createError } from '../utils'
import { stringify } from 'csv-stringify/sync'
import {
    CkoSettlementBreakdownRecord,
    FloatDecimal,
    UberSettlementBreakdownColumns,
    UberSettlementBreakdownRecord,
} from '../types'
import { CsvFileStreamReader, ReaderInterface } from '../services/readers'
import { ConsoleWriter, FileBatchWriter, FileStreamWriter, WriterInterface } from '../services'
import { CkoSettlementBreakdownCsvMapper, MapperInterface } from '../services/mappers'
import {
    ProcessorInterface,
    SettlementBreakdownProcessor,
    SettlementBreakdownProcessorMetrics,
} from '../services/processors'

/**
 * Job
 */
export const generateSettlementReport = async (inputFileName: string): Promise<object> => {
    let generator: {
        success: boolean
        duration: number
        input: string | null
        output: string | null
        metrics: unknown
    } = {
        success: false,
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

        // Prepare the reader
        const reader: ReaderInterface = new CsvFileStreamReader(inputFileName)
        try {
            await reader.open()
        } catch (e: unknown) {
            const error: Error = createError(e)
            throw new Error(`failed to open the resource: ${error.message}`)
        }

        // Prepare the mapper
        const mapper: MapperInterface<
            Record<string, string>,
            CkoSettlementBreakdownRecord
        > = new CkoSettlementBreakdownCsvMapper()
        const inputRows = await reader.read()
        const mappedRows = (async function* () {
            for await (const row of inputRows) {
                yield mapper.map(row)
            }
        })()

        // Set payout date
        // TODO: this date needs to come either from the file name, or deducted from the rows
        const payoutDate: Date = new Date(new Date().setUTCHours(0, 0, 0, 0))

        // Set output file
        // TODO: output file name and path need to be set properly
        const outputFileName = `settlement_report_${payoutDate.toISOString().slice(0, 10).replace(/-/g, '')}_00n.csv`
        const outputFilePath = 'generated/' + path.basename(outputFileName)

        generator.output = outputFilePath

        // Prepare the writer
        //const reportWriter: WriterInterface = new ConsoleWriter()
        const writer: WriterInterface = new FileStreamWriter(outputFilePath)
        await writer.open()

        // Retrieve and write column definition
        const uberSettlementBreakdownColumns = Object.entries(UberSettlementBreakdownColumns).map(([key, header]) => ({
            key,
            header,
        }))
        await writer.write(stringify([], { header: true, columns: uberSettlementBreakdownColumns }).trim())

        // Prepare the processor
        const processor: ProcessorInterface<
            CkoSettlementBreakdownRecord,
            UberSettlementBreakdownRecord,
            SettlementBreakdownProcessorMetrics
        > = new SettlementBreakdownProcessor(payoutDate, outputFileName)

        // Process mapped lines and write
        for await (const row of processor.process(mappedRows)) {
            await writer.write(
                stringify([row], {
                    header: false,
                    columns: uberSettlementBreakdownColumns,
                    cast: {
                        object: (value: unknown) => (value instanceof FloatDecimal ? value.toFixed(8) : String(value)),
                        date: (value) => (value instanceof Date ? value.toISOString().slice(0, 23) : String(value)),
                    },
                }).trim()
            )
        }

        // Close the reader & writer
        await reader.close()
        await writer.close()

        generator.success = true
        generator.metrics = processor.metrics()
    } catch (e: unknown) {
        // TODO: log error results properly
        const error: Error = createError(e)

        console.log('[ERROR]')
        console.log(error)
        console.log(error.message)

        throw new Error()
    } finally {
    }

    generator.duration = performance.now() - generator.duration
    return generator
}

/**
 * Bootstrap
 */
/* istanbul ignore next */
if (require.main === module) {
    ;(async () => {
        try {
            const [, , inputFileName] = process.argv
            const generator: any = await generateSettlementReport(inputFileName)

            // Log success results
            console.log(
                `OK (${generator.duration.toFixed(0)}ms): ` +
                    `${generator.input} (${generator?.metrics?.rowsIn.toLocaleString()} rows) --> ${generator.output} (${generator.metrics.rowsOut.toLocaleString()} rows)`
            )

            process.exit(0)
        } catch (e: unknown) {
            const error: Error = createError(e)
            console.error('Job failed', error.message)
            process.exit(1)
        }
    })()
}
