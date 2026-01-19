import { WriterInterface } from './WriterInterface'
import { promises as fs } from 'fs'
import { dirname } from 'path'
import { createError } from '../../utils'

export class FileBatchWriter implements WriterInterface {
    private filePath: string
    private tmpFilePath: string
    private lines: string[] = []

    constructor(filePath: string) {
        this.filePath = filePath
        this.tmpFilePath = `${filePath}.tmp`
    }

    async open(): Promise<boolean> {
        try {
            await fs.mkdir(dirname(this.tmpFilePath), { recursive: true })
            this.lines = []
        } catch (e: unknown) {
            const error: Error = createError(e)
            throw error
        }

        return true
    }

    async write(line: string): Promise<boolean> {
        this.lines.push(line)
        return true
    }

    async close(): Promise<boolean> {
        try {
            await fs.writeFile(this.tmpFilePath, this.lines.join('\n'), 'utf-8')
            await fs.rename(this.tmpFilePath, this.filePath)
        } catch (e: unknown) {
            const error: Error = createError(e)
            throw error
        }

        return true
    }
}
