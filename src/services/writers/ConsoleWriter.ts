import { Writer } from './Writer'

export class ConsoleWriter implements Writer {
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
