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
import { CkoSettlementBreakdownCsvMapper } from '../services/mappers'
import {
    ProcessorInterface,
    SettlementBreakdownProcessor,
    SettlementBreakdownProcessorMetrics,
} from '../services/processors'

/**
 * Job
 */
const main = async (): Promise<void> => {
    console.time()
    const [, , inputFileName] = process.argv

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
        const mapper = new CkoSettlementBreakdownCsvMapper()
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

        // Log success results
        console.log('[OK...]')
        console.log(
            `${inputFileName} (${processor.metrics().rowsIn.toLocaleString()} rows) --> ${outputFileName} (${processor.metrics().rowsOut.toLocaleString()} rows)`
        )
    } catch (e: unknown) {
        // TODO: log error results properly
        const error: Error = createError(e)

        console.log('[ERROR]')
        console.log(error.message)
        process.exit(1)
    } finally {
        console.timeEnd()
    }
}

/**
 * Bootstrap
 */
;(async () => {
    try {
        await main()
        process.exit(0)
    } catch (e: unknown) {
        const error: Error = createError(e)
        console.error('Job failed', error.message)
        process.exit(1)
    }
})()
