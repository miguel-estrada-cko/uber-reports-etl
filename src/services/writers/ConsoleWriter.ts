import { WriterInterface } from './WriterInterface'

export class ConsoleWriter implements WriterInterface {
    constructor() {}

    async open(): Promise<boolean> {
        return true
    }
    async write(line: string): Promise<boolean> {
        console.log(line)
        return true
    }
    async close(): Promise<boolean> {
        return true
    }
}
