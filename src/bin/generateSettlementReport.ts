#!/usr/bin/env node
import fs, { ReadStream } from 'fs'
import path from 'path'
import {
    createError,
    createSettlementBreakdownRowsMetrics,
    generateSettlementBreakdownRows,
    GenerateSettlementBreakdownRowsMetrics,
} from '../utils'
import { stringify } from 'csv-stringify/sync'
import { CkoSettlementBreakdownReport, FloatDecimal, UberSettlementBreakdownColumns } from '../types'
import { ConsoleWriter, FileBatchWriter, FileStreamWriter, WriterInterface } from '../services'
import { once } from 'events'

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

        const inputFilePath: string = path.resolve(process.cwd(), inputFileName)
        if (!fs.existsSync(inputFilePath)) {
            throw new Error(`file not exists: ${inputFilePath}`)
        }

        // Set payout date
        // TODO: this date needs to come either from the file name, or deducted from the rows
        const payoutDate = new Date()
        payoutDate.setUTCHours(0, 0, 0, 0)

        // Set output file
        // TODO: output file name and path need to be set properly
        const outputFileName = `settlement_report_${payoutDate.toISOString().slice(0, 10).replace(/-/g, '')}_00n.csv`
        const outputFilePath = 'generated/' + path.basename(outputFileName)

        // Create the report definition for the generator
        const settlementBreakdownReport: CkoSettlementBreakdownReport = {
            Date: payoutDate,
            InputFileStream: fs.createReadStream(inputFilePath, { encoding: 'utf-8' }),
            OutputFileName: outputFileName,
        }

        // Prepare the writer
        //const reportWriter: WriterInterface = new ConsoleWriter()
        const reportWriter: WriterInterface = new FileStreamWriter(outputFilePath)
        await reportWriter.open()

        // Retrieve and write column definition
        const uberSettlementBreakdownColumns = Object.entries(UberSettlementBreakdownColumns).map(([key, header]) => ({
            key,
            header,
        }))

        await reportWriter.write(stringify([], { header: true, columns: uberSettlementBreakdownColumns }).trim())

        // Get and write the rows from the generator
        const generatorMetrics: GenerateSettlementBreakdownRowsMetrics = createSettlementBreakdownRowsMetrics()
        for await (const row of generateSettlementBreakdownRows(settlementBreakdownReport, generatorMetrics)) {
            await reportWriter.write(
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

        // Close the writer
        await reportWriter.close()

        // Log success results
        console.log('[OK]')
        console.log(
            `${inputFileName} (${generatorMetrics.rowsIn.toLocaleString()} rows) --> ${outputFileName} (${generatorMetrics.rowsOut.toLocaleString()} rows)`
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
