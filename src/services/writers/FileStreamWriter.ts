import { Writer } from './Writer'
import { promises as fsp } from 'fs'
import fs from 'fs'
import { dirname } from 'path'
import { once } from 'events'
import { createError } from '../../utils'

export class FileStreamWriter implements Writer {
    private filePath: string
    private tmpFilePath: string
    private stream?: fs.WriteStream

    constructor(filePath: string) {
        this.filePath = filePath
        this.tmpFilePath = `${filePath}.tmp`
    }

    async open(): Promise<boolean> {
        try {
            await fsp.mkdir(dirname(this.tmpFilePath), { recursive: true })
            this.stream = fs.createWriteStream(this.tmpFilePath, { encoding: 'utf8' })
        } catch (e: unknown) {
            const error: Error = createError(e)
            throw error
        }

        return true
    }

    async write(line: string): Promise<boolean> {
        if (!this.stream) {
            throw createError(new Error('stream is not open'))
        }

        const canContinue = this.stream.write(line + '\n')
        if (!canContinue) {
            await once(this.stream, 'drain')
        }

        return true
    }

    async close(): Promise<boolean> {
        try {
            if (!this.stream) return true

            this.stream.end()
            await once(this.stream, 'finish')

            await fsp.rename(this.tmpFilePath, this.filePath)
        } catch (e: unknown) {
            const error: Error = createError(e)
            throw error
        }

        return true
    }
}
