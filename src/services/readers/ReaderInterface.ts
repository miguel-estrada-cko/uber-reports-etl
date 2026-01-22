export interface ReaderInterface {
    open(): Promise<boolean>

    read(): Promise<AsyncIterable<any>>

    close(): Promise<boolean>
}
