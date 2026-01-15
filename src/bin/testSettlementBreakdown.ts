#!/usr/bin/env node
import fs, { ReadStream } from 'fs'
import path from 'path'
import { createError, generateSettlementBreakdownRows } from '../utils'
import { stringify } from 'csv-stringify/sync'
import { CkoSettlementBreakdownReport, Float, FloatDecimal, UberSettlementBreakdownColumns } from '../types'
import { ConsoleWriter, FileWriter } from '../services'

/**
 * Job
 */
const main = async (): Promise<void> => {
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
        const settlementBreakdownReport: CkoSettlementBreakdownReport = {
            Date: new Date(), // TODO: this date needs to come either from the file name, or deducted from the rows
            FileBuffer: fileStream,
        }

        // Prepare the writer
        //const reportWriter = new ConsoleWriter()
        const reportWriter = new FileWriter(`${filePath}-output.csv`)
        await reportWriter.open()

        // Columns
        const uberSettlementBreakdownColumns = Object.entries(UberSettlementBreakdownColumns).map(([key, header]) => ({
            key,
            header,
        }))

        const columnsLine = stringify([], { header: true, columns: uberSettlementBreakdownColumns }).trim()

        await reportWriter.write(columnsLine)

        // Get the rows from the generator
        for await (const row of generateSettlementBreakdownRows(settlementBreakdownReport)) {
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

        console.log('...done!')
    } catch (e: unknown) {
        const error: Error = createError(e)

        console.log(error.message)
        process.exit(1)
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
