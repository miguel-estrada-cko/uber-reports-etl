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
import { ConsoleWriter, FileBatchWriter, WriterInterface } from '../services'

/**
 * Job
 */
const main = async (): Promise<void> => {
    console.time()
    const [, , fileName] = process.argv

    try {
        // Verify source file
        if (!fileName) {
            throw new Error(`filename not provided`)
        }

        const filePath: string = path.resolve(process.cwd(), fileName)
        if (!fs.existsSync(filePath)) {
            throw new Error(`file not exists: ${filePath}`)
        }

        // Read the file
        const fileStream: ReadStream = fs.createReadStream(filePath, { encoding: 'utf-8' })

        const payoutDate = new Date() // TODO: this date needs to come either from the file name, or deducted from the rows
        payoutDate.setUTCHours(0, 0, 0, 0)
        const settlementBreakdownReport: CkoSettlementBreakdownReport = {
            Date: payoutDate,
            FileStream: fileStream,
        }

        // Prepare the writer
        //const reportWriter: WriterInterface = new ConsoleWriter()
        const reportWriter: WriterInterface = new FileBatchWriter(`${filePath}-output.csv`)
        await reportWriter.open()

        // Columns
        const uberSettlementBreakdownColumns = Object.entries(UberSettlementBreakdownColumns).map(([key, header]) => ({
            key,
            header,
        }))

        const columns = stringify([], { header: true, columns: uberSettlementBreakdownColumns }).trim()
        await reportWriter.write(columns)

        // Get the rows from the generator
        const generatorMetrics: GenerateSettlementBreakdownRowsMetrics = createSettlementBreakdownRowsMetrics()
        for await (const row of generateSettlementBreakdownRows(settlementBreakdownReport, generatorMetrics)) {
            const line = stringify([row], {
                header: false,
                columns: uberSettlementBreakdownColumns,
                cast: {
                    object: (value: unknown) => (value instanceof FloatDecimal ? value.toFixed(8) : String(value)),
                    date: (value) => (value instanceof Date ? value.toISOString().slice(0, 23) : String(value)),
                },
            }).trim()

            await reportWriter.write(line)
        }

        // Close the writer
        await reportWriter.close()

        console.log(
            `OK, input: ${fileName}, ${generatorMetrics.rowsIn.toLocaleString()} rows read, ${generatorMetrics.rowsOut.toLocaleString()} rows written`
        )
    } catch (e: unknown) {
        const error: Error = createError(e)

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
