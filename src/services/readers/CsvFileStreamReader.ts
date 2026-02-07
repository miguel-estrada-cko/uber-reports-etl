import { Reader } from './Reader'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { parse } from 'csv-parse'
import { ReaderException } from './ReaderException'

export class CsvFileStreamReader implements Reader {
    private filePath: string
    private fileStream: Readable = new Readable()

    constructor(filePath: string) {
        this.filePath = path.resolve(process.cwd(), filePath)
    }

    async open(): Promise<boolean> {
        if (!fs.existsSync(this.filePath)) {
            throw new ReaderException.ResourceNotFound(this.filePath)
        }

        try {
            this.fileStream = Readable.from(fs.createReadStream(this.filePath, { encoding: 'utf-8' })).pipe(
                parse({ columns: true, trim: true, delimiter: ',' })
            )
        } catch (error) {
            throw new ReaderException.ResourceAccessDenied(this.filePath)
        }

        return true
    }

    async read(): Promise<AsyncIterable<Record<string, string>>> {
        return this.fileStream
    }

    async close(): Promise<boolean> {
        try {
            this.fileStream.destroy()
        } catch (error) {
            // Silent errors on close
        }

        return true
    }
}
