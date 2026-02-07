export interface Reader {
    open(): Promise<boolean>

    read(): Promise<AsyncIterable<any>>

    close(): Promise<boolean>
}
